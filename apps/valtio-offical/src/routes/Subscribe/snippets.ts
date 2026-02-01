import type {Locale} from 'src/i18n/translations'

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

export const subscribeSnippetEn = `// ========== 1. Import and concepts ==========
import { createStore, useStore } from '@empjs/valtio'

// Subscription API flow:
// - subscribeKey / subscribeKeys: outside React, listen to specific keys (persist, logger, sync with external)
// - batch: merge multiple writes into one notification, fewer intermediate renders
// - useSnapshot: subscribes only to paths actually accessed; read only what you need for fine-grained updates

// ========== 2. subscribeKey: single key ==========
const store = createStore({ count: 0, name: '' })
// Subscribe to one key, callback gets latest value; returns Unsubscribe (e.g. return unsub in useEffect)
const unsub = store.subscribeKey('count', (value) => {
  console.log('count changed', value)
})
useEffect(() => {
  const unsub = store.subscribeKey('count', (v) => setLog(prev => prev + \`count=\${v}\\n\`))
  return unsub
}, [store])

// ========== 3. subscribeKeys: multiple keys ==========
const unsub2 = store.subscribeKeys(['count', 'name'], (key, value) => {
  console.log(key, value)
})
useEffect(() => {
  const unsub = store.subscribeKeys(['count', 'name'], (k, v) => setLog(prev => prev + \`\${k}=\${v}\\n\`))
  return unsub
}, [store])

// ========== 4. batch: bulk update (fewer renders in flow) ==========
// Multiple writes inside batch trigger one subscription; no intermediate useSnapshot re-renders
store.batch((s) => {
  s.count = 1
  s.name = 'a'
})

// ========== 5. Fine-grained: read only used fields ==========
// useSnapshot(store) subscribes only to paths you access; OnlyCount does not re-render when store.name changes
function OnlyCount() {
  const snap = store.useSnapshot()
  return <span>{snap.count}</span>
}
function OnlyName() {
  const snap = store.useSnapshot()
  return <span>{snap.name}</span>
}

// ========== 6. When to use ==========
// subscribeKey / subscribeKeys: non-React logic (persist, logger, external sync)
// batch: when one action updates many fields, reduce intermediate renders
// Fine-grained: with large store, each component reads only what it needs, no manual selector
`

export const subscribeBasicSnippet = `// ========== 1. 基础订阅 (subscribe) ==========
import { subscribe } from '@empjs/valtio'

// 监听整个 store 及其子节点的所有变化
subscribe(store, () => {
  console.log('Store updated:', store)
})
`

export const subscribeKeySnippet = `// ========== 2. 单 Key 订阅 (subscribeKey) ==========
// 仅当 'count' 字段变化时触发
store.subscribeKey('count', (val) => {
  console.log('Count changed:', val)
})
`

export const subscribeKeysSnippet = `// ========== 3. 多 Key 订阅 (subscribeKeys) ==========
// 当 'count' 或 'name' 变化时触发
store.subscribeKeys(['count', 'name'], (key, val) => {
  console.log(key, 'changed to', val)
})
`

export const subscribeBatchSnippet = `// ========== 4. 批量更新 (batch) ==========
// 合并多次更新为一次通知，减少中间渲染
store.batch((s) => {
  s.count = 0
  s.name = 'reset'
})
`

export const subscribeBasicSnippetEn = `// ========== 1. Basic Subscribe ==========
import { subscribe } from '@empjs/valtio'

// Listen to any change in the store tree
subscribe(store, () => {
  console.log('Store updated:', store)
})
`

export const subscribeKeySnippetEn = `// ========== 2. Subscribe Key ==========
// Trigger only when 'count' changes
store.subscribeKey('count', (val) => {
  console.log('Count changed:', val)
})
`

export const subscribeKeysSnippetEn = `// ========== 3. Subscribe Keys (Multiple) ==========
// Trigger when 'count' or 'name' changes
store.subscribeKeys(['count', 'name'], (key, val) => {
  console.log(key, 'changed to', val)
})
`

export const subscribeBatchSnippetEn = `// ========== 4. Batch Update ==========
// Merge multiple updates into one notification
store.batch((s) => {
  s.count = 0
  s.name = 'reset'
})
`

export function getSubscribeSnippet(locale: Locale) {
  if (locale === 'zh') {
    return [subscribeBasicSnippet, subscribeKeySnippet, subscribeKeysSnippet, subscribeBatchSnippet].join('\n')
  }
  return [subscribeBasicSnippetEn, subscribeKeySnippetEn, subscribeKeysSnippetEn, subscribeBatchSnippetEn].join('\n')
}
