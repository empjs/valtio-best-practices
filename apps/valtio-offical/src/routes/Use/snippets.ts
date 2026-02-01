import type {Locale} from 'src/i18n/translations'

const snippetZh = `import { createStore, useStore } from '@empjs/valtio'

// ========== 1. 常规用法 (Regular) ==========
// 1.1 全局 Store：单例共享
const globalStore = createStore({ count: 0 })

function GlobalComp() {
  const snap = globalStore.useSnapshot()
  return (
    <button onClick={() => globalStore.set('count', snap.count + 1)}>
      Count: {snap.count}
    </button>
  )
}

// 1.2 局部 Store：组件隔离
function LocalComp() {
  const [snap, store] = useStore({ count: 0 })
  return (
    <button onClick={() => store.set('count', snap.count + 1)}>
      Count: {snap.count}
    </button>
  )
}

// ========== 2. 历史记录 (History) ==========
// options 开启 history，自动获得 undo/redo 能力
// 2.1 全局
const historyStore = createStore(
  { count: 0 },
  { history: {} } // 开启历史
)
// 2.2 局部
function LocalHistory() {
  const [snap, store] = useStore(() => ({ count: 0 }), { history: {} })
  
  return (
    <>
      <div>Count: {snap.value.count}</div>
      <button onClick={() => store.undo()} disabled={!snap.isUndoEnabled}>Undo</button>
      <button onClick={() => store.redo()} disabled={!snap.isRedoEnabled}>Redo</button>
    </>
  )
}

// ========== 3. 派生状态 (Derive) ==========
// options 开启 derive，自动计算依赖属性
// 3.1 全局 (返回 { base, derived })
const { base, derived } = createStore(
  { a: 1, b: 2 },
  {
    derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b })
  }
)
// base.useSnapshot() 读基础，derived.useSnapshot() 读派生

// 3.2 局部 (返回 [baseSnap, baseStore, derivedSnap])
function LocalDerive() {
  const [baseSnap, baseStore, derivedSnap] = useStore(
    () => ({ a: 1, b: 2 }),
    {
      derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b })
    }
  )
  return <div>Sum: {derivedSnap.sum}</div>
}
`

const snippetEn = `import { createStore, useStore } from '@empjs/valtio'

// ========== 1. Regular Usage ==========
// 1.1 Global Store: Singleton shared
const globalStore = createStore({ count: 0 })

function GlobalComp() {
  const snap = globalStore.useSnapshot()
  return (
    <button onClick={() => globalStore.set('count', snap.count + 1)}>
      Count: {snap.count}
    </button>
  )
}

// 1.2 Local Store: Component isolated
function LocalComp() {
  const [snap, store] = useStore({ count: 0 })
  return (
    <button onClick={() => store.set('count', snap.count + 1)}>
      Count: {snap.count}
    </button>
  )
}

// ========== 2. History Usage ==========
// Enable history via options for undo/redo
// 2.1 Global
const historyStore = createStore(
  { count: 0 },
  { history: {} } // enable history
)
// 2.2 Local
function LocalHistory() {
  const [snap, store] = useStore(() => ({ count: 0 }), { history: {} })
  
  return (
    <>
      <div>Count: {snap.value.count}</div>
      <button onClick={() => store.undo()} disabled={!snap.isUndoEnabled}>Undo</button>
      <button onClick={() => store.redo()} disabled={!snap.isRedoEnabled}>Redo</button>
    </>
  )
}

// ========== 3. Derive Usage ==========
// Enable derive via options for computed properties
// 3.1 Global (returns { base, derived })
const { base, derived } = createStore(
  { a: 1, b: 2 },
  {
    derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b })
  }
)
// base.useSnapshot() for base, derived.useSnapshot() for derived

// 3.2 Local (returns [baseSnap, baseStore, derivedSnap])
function LocalDerive() {
  const [baseSnap, baseStore, derivedSnap] = useStore(
    () => ({ a: 1, b: 2 }),
    {
      derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b })
    }
  )
  return <div>Sum: {derivedSnap.sum}</div>
}
`

export function getUseSnippet(locale: Locale) {
  return locale === 'zh' ? snippetZh : snippetEn
}
