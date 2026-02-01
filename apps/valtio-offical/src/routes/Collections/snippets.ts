import type {Locale} from 'src/i18n/translations'

/**
 * createMap / createSet 完整示例：可代理的 Map/Set，增删改会触发订阅更新
 * 调用闭环：createMap/createSet 创建 → 放入 store 或 useStore → 读 snap.map.get / snap.tagSet.has → 写 store.map.set / store.tagSet.add → 触发 UI 更新
 */
export const collectionsSnippet = `import { createMap, createSet, createStore, useStore } from '@empjs/valtio'

// ========== 1. Map 用法 (createMap) ==========
// 1.1 全局 Map (Global)
// 跨组件共享，支持 .get/.set/.delete/.clear/.size 及 forEach/entries/keys/values
const globalMapStore = createStore({
  map: createMap<string, number>([['a', 1]])
})

function GlobalMapDemo() {
  const snap = globalMapStore.useSnapshot() // 订阅
  return (
    <button onClick={() => globalMapStore.map.set('a', (snap.map.get('a')||0) + 1)}>
       Value: {snap.map.get('a')} (Size: {snap.map.size})
    </button>
  )
}

// 1.2 局部 Map (Local)
// 组件内隔离，API 与全局一致
function LocalMapDemo() {
  const [snap, store] = useStore(() => ({
    map: createMap([['a', 1]])
  }))
  return (
    <button onClick={() => store.map.set('b', 2)}>
      Add B (Has B: {String(snap.map.has('b'))})
    </button>
  )
}

// ========== 2. Set 用法 (createSet) ==========
// 2.1 全局 Set (Global)
// 跨组件共享，支持 .add/.delete/.clear/.has/.size 及 forEach/keys/values
const globalSetStore = createStore({
  tags: createSet(['react'])
})

function GlobalSetDemo() {
  const snap = globalSetStore.useSnapshot()
  return (
    <button onClick={() => globalSetStore.tags.add('valtio')}>
      Add Valtio (Size: {snap.tags.size})
    </button>
  )
}

// 2.2 局部 Set (Local)
function LocalSetDemo() {
  const [snap, store] = useStore({
    tags: createSet(['x'])
  })
  return (
    <button onClick={() => store.tags.delete('x')}>
      Remove X (Has X: {String(snap.tags.has('x'))})
    </button>
  )
}
`

export const collectionsSnippetEn = `import { createMap, createSet, createStore, useStore } from '@empjs/valtio'

// ========== 1. Map Usage (createMap) ==========
// 1.1 Global Map
// Shared across components. Supports .get/.set/.delete/.clear/.size etc.
const globalMapStore = createStore({
  map: createMap<string, number>([['a', 1]])
})

function GlobalMapDemo() {
  const snap = globalMapStore.useSnapshot() // Subscribe
  return (
    <button onClick={() => globalMapStore.map.set('a', (snap.map.get('a')||0) + 1)}>
       Value: {snap.map.get('a')} (Size: {snap.map.size})
    </button>
  )
}

// 1.2 Local Map
// Component-isolated. Same API.
function LocalMapDemo() {
  const [snap, store] = useStore(() => ({
    map: createMap([['a', 1]])
  }))
  return (
    <button onClick={() => store.map.set('b', 2)}>
      Add B (Has B: {String(snap.map.has('b'))})
    </button>
  )
}

// ========== 2. Set Usage (createSet) ==========
// 2.1 Global Set
// Shared across components. Supports .add/.delete/.clear/.has/.size etc.
const globalSetStore = createStore({
  tags: createSet(['react'])
})

function GlobalSetDemo() {
  const snap = globalSetStore.useSnapshot()
  return (
    <button onClick={() => globalSetStore.tags.add('valtio')}>
      Add Valtio (Size: {snap.tags.size})
    </button>
  )
}

// 2.2 Local Set
function LocalSetDemo() {
  const [snap, store] = useStore({
    tags: createSet(['x'])
  })
  return (
    <button onClick={() => store.tags.delete('x')}>
      Remove X (Has X: {String(snap.tags.has('x'))})
    </button>
  )
}
`

export function getCollectionsSnippet(locale: Locale) {
  return locale === 'zh' ? collectionsSnippet : collectionsSnippetEn
}
