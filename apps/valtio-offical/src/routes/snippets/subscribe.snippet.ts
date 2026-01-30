/**
 * subscribe 完整示例：subscribeKey / subscribeKeys、batch、细粒度订阅
 * 调用闭环：createStore → subscribeKey/Keys 注册回调 → store.set/update 触发回调（如写日志/持久化）→ batch 内多次写只触发一次通知 → useSnapshot 只读用到的字段则只在该路径变化时重渲染
 */
export const subscribeSnippet = `// ========== 1. 导入与概念 ==========
import { createStore, useStore } from '@empjs/valtio'

// 订阅相关 API 闭环：
// - subscribeKey / subscribeKeys：非 React 场景下只监听指定 key，用于持久化、logger、与外部系统同步
// - batch：多次写合并为一次通知，减少中间渲染
// - useSnapshot：只在实际「访问」的路径上建立订阅，只读用到的字段即可细粒度更新

// ========== 2. subscribeKey：单 key 订阅 ==========
const store = createStore({ count: 0, name: '' })
// 只订阅单个 key 变化，回调参数为最新 value；返回 Unsubscribe，用于取消订阅（如 useEffect 里 return unsub）
const unsub = store.subscribeKey('count', (value) => {
  console.log('count changed', value)
})
useEffect(() => {
  const unsub = store.subscribeKey('count', (v) => setLog(prev => prev + \`count=\${v}\\n\`))
  return unsub
}, [store])

// ========== 3. subscribeKeys：多 key 订阅 ==========
const unsub2 = store.subscribeKeys(['count', 'name'], (key, value) => {
  console.log(key, value)
})
useEffect(() => {
  const unsub = store.subscribeKeys(['count', 'name'], (k, v) => setLog(prev => prev + \`\${k}=\${v}\\n\`))
  return unsub
}, [store])

// ========== 4. batch：批量更新（闭环中减少渲染次数）==========
// 多次写放在 batch 内，只触发一次订阅通知；中间不会触发 useSnapshot 的组件重渲染
store.batch((s) => {
  s.count = 1
  s.name = 'a'
})

// ========== 5. 细粒度订阅：只读用到的字段 ==========
// useSnapshot(store) 只在实际「访问」的路径上建立订阅；改 store.name 时 OnlyCount 不重渲染
function OnlyCount() {
  const snap = store.useSnapshot()
  return <span>{snap.count}</span>
}
function OnlyName() {
  const snap = store.useSnapshot()
  return <span>{snap.name}</span>
}

// ========== 6. 何时用 ==========
// subscribeKey / subscribeKeys：非 React 逻辑（持久化、logger、与外部系统同步）
// batch：一次操作要改多个字段时，减少中间渲染
// 细粒度：大 store 时尽量每个组件只读自己需要的字段，无需手写 selector
`
