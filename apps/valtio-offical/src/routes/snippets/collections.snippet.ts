/**
 * createMap / createSet 完整示例：可代理的 Map/Set，增删改会触发订阅更新
 * 调用闭环：createMap/createSet 创建 → 放入 store 或 useStore → 读 snap.map.get / snap.tagSet.has → 写 store.map.set / store.tagSet.add → 触发 UI 更新
 */
export const collectionsSnippet = `// ========== 1. 导入 ==========
// 创建可代理的 Map/Set，在 store 或组件内使用，增删改会触发订阅更新
import { createMap, createSet, useStore } from '@empjs/valtio'

// ========== 2. 模块级或 store 内创建 ==========
const map = createMap<string, number>([['a', 1]])
const tagSet = createSet<string>(['x'])

// ========== 3. 在 store 里作为状态一部分（调用闭环）==========
// 注意：勿用 key 名 "set"，会与 store.set(key, value) 方法冲突
const [snap, store] = useStore(() => ({
  map: createMap([['a', 1]]),
  tagSet: createSet(['x']),
}))

// 读：snap.map.get('a')、snap.tagSet.has('x')、Array.from(snap.map.entries()) 等
// 写：store.map.set('b', 2)、store.tagSet.add('y')、store.map.delete('a') — 会触发 UI 更新
// 闭环：用户点击 → store.map.set / store.tagSet.add → 订阅者收到新快照 → 组件用 snap 重渲染
`
