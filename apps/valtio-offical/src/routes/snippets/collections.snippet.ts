/**
 * createMap / createSet 完整示例：可代理的 Map/Set，增删改会触发订阅更新
 * 调用闭环：createMap/createSet 创建 → 放入 store 或 useStore → 读 snap.map.get / snap.tagSet.has → 写 store.map.set / store.tagSet.add → 触发 UI 更新
 */
export const collectionsSnippet = `// ========== 1. 导入 ==========
import { createMap, createSet, createStore, useStore } from '@empjs/valtio'

// ========== 2. 全局 createStore（跨组件共享）==========
// 模块级创建，多处组件用 store.useSnapshot() 读、store.map / store.tagSet 写，任意一处变更会同步到所有实例
const collectionsStore = createStore(
  {
    map: createMap<string, number>([['a', 1], ['b', 2]]),
    tagSet: createSet<string>(['x']),
  },
  { name: 'CollectionsStore' },
)

// 组件内：const snap = collectionsStore.useSnapshot()
// 读：snap.map.get('a')、snap.map.size、snap.tagSet.has('x')、snap.tagSet.size、Array.from(snap.map.entries())
// 写：collectionsStore.map.set('c', 3)、collectionsStore.map.delete('a')、collectionsStore.tagSet.add('y')、collectionsStore.tagSet.clear()

// ========== 3. 局部 useStore（每实例独立）==========
// 注意：勿用 key 名 "set"，会与 store.set(key, value) 方法冲突
const [snap, store] = useStore(() => ({
  map: createMap([['a', 1]]),
  tagSet: createSet(['x']),
}))

// 读：snap.map.get('a')、snap.map.size、snap.tagSet.has('x')、snap.tagSet.size
// 写：store.map.set('b', 2)、store.map.delete('a')、store.tagSet.add('y')、store.tagSet.delete('x')、store.tagSet.clear()
// 闭环：用户操作 → store.map / store.tagSet 变更 → 订阅者收到新快照 → 组件用 snap 重渲染

// ========== 4. 组件内使用示例（全局 store）==========
function GlobalCollectionsDemo() {
  const snap = collectionsStore.useSnapshot()
  const mapEntries = Array.from(snap.map.entries())
  const setValues = Array.from(snap.tagSet)
  return (
    <div>
      <p>Map ({snap.map.size}): {mapEntries.map(([k, v]) => \`\${k}=\${v}\`).join(', ') || '—'}</p>
      <p>Set ({snap.tagSet.size}): {setValues.join(', ') || '—'}</p>
      <button onClick={() => collectionsStore.map.set('c', (snap.map.get('c') ?? 0) + 1)}>map.set('c', n+1)</button>
      <button onClick={() => collectionsStore.tagSet.add('y')}>tagSet.add('y')</button>
      <button onClick={() => collectionsStore.map.delete('a')}>map.delete('a')</button>
      <button onClick={() => collectionsStore.tagSet.delete('x')}>tagSet.delete('x')</button>
    </div>
  )
}

// ========== 5. 组件内使用示例（局部 useStore）==========
function LocalCollectionsDemo() {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([['a', 1], ['b', 2]]),
    tagSet: createSet<string>(['x']),
  }))
  const mapEntries = Array.from(snap.map.entries())
  const setValues = Array.from(snap.tagSet)
  return (
    <div>
      <p>Map: {mapEntries.map(([k, v]) => \`\${k}=\${v}\`).join(', ')}</p>
      <p>Set: {setValues.join(', ')}</p>
      <button onClick={() => store.map.set('c', 3)}>store.map.set('c', 3)</button>
      <button onClick={() => store.tagSet.clear()}>store.tagSet.clear()</button>
    </div>
  )
}
`

export const collectionsSnippetEn = `// ========== 1. Import ==========
import { createMap, createSet, createStore, useStore } from '@empjs/valtio'

// ========== 2. Global createStore (shared across components) ==========
// Create at module level; multiple components use store.useSnapshot() to read, store.map / store.tagSet to write; changes sync to all.
const collectionsStore = createStore(
  {
    map: createMap<string, number>([['a', 1], ['b', 2]]),
    tagSet: createSet<string>(['x']),
  },
  { name: 'CollectionsStore' },
)

// In component: const snap = collectionsStore.useSnapshot()
// Read: snap.map.get('a'), snap.map.size, snap.tagSet.has('x'), snap.tagSet.size, Array.from(snap.map.entries())
// Write: collectionsStore.map.set('c', 3), collectionsStore.map.delete('a'), collectionsStore.tagSet.add('y'), collectionsStore.tagSet.clear()

// ========== 3. Local useStore (per-instance) ==========
// Note: avoid key name "set", conflicts with store.set(key, value)
const [snap, store] = useStore(() => ({
  map: createMap([['a', 1]]),
  tagSet: createSet(['x']),
}))

// Read: snap.map.get('a'), snap.map.size, snap.tagSet.has('x'), snap.tagSet.size
// Write: store.map.set('b', 2), store.map.delete('a'), store.tagSet.add('y'), store.tagSet.delete('x'), store.tagSet.clear()
// Flow: user action → store.map / store.tagSet change → subscribers get new snapshot → component re-renders with snap

// ========== 4. Usage in component (global store) ==========
function GlobalCollectionsDemo() {
  const snap = collectionsStore.useSnapshot()
  const mapEntries = Array.from(snap.map.entries())
  const setValues = Array.from(snap.tagSet)
  return (
    <div>
      <p>Map ({snap.map.size}): {mapEntries.map(([k, v]) => \`\${k}=\${v}\`).join(', ') || '—'}</p>
      <p>Set ({snap.tagSet.size}): {setValues.join(', ') || '—'}</p>
      <button onClick={() => collectionsStore.map.set('c', (snap.map.get('c') ?? 0) + 1)}>map.set('c', n+1)</button>
      <button onClick={() => collectionsStore.tagSet.add('y')}>tagSet.add('y')</button>
      <button onClick={() => collectionsStore.map.delete('a')}>map.delete('a')</button>
      <button onClick={() => collectionsStore.tagSet.delete('x')}>tagSet.delete('x')</button>
    </div>
  )
}

// ========== 5. Usage in component (local useStore) ==========
function LocalCollectionsDemo() {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([['a', 1], ['b', 2]]),
    tagSet: createSet<string>(['x']),
  }))
  const mapEntries = Array.from(snap.map.entries())
  const setValues = Array.from(snap.tagSet)
  return (
    <div>
      <p>Map: {mapEntries.map(([k, v]) => \`\${k}=\${v}\`).join(', ')}</p>
      <p>Set: {setValues.join(', ')}</p>
      <button onClick={() => store.map.set('c', 3)}>store.map.set('c', 3)</button>
      <button onClick={() => store.tagSet.clear()}>store.tagSet.clear()</button>
    </div>
  )
}
`
