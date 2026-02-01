import type {Locale} from 'src/i18n/translations'

const snippets: Record<Locale, string> = {
  zh: `import { type EnhancedStore, createStore, useStore } from '@empjs/valtio'

// 1. 调用闭环（必守）：读用 snap，写用 store；勿用 store.xxx 做渲染
//    历史 store：读 snap.value.xxx，写 store.value.xxx；undo/redo 用 snap.undo()/snap.redo()
// ------------------------------------------------------------------

// 2. 类型定义：使用 EnhancedStore<T>（勿手写 interface MyStore）
// ------------------------------------------------------------------
type MyState = { count: number; name: string }
type MyStore = EnhancedStore<MyState>

// 3. 选型：单例/跨组件 → createStore；组件内每实例 → useStore
// 4. 常规 Store：createStore 模块级、useStore 返回 [snap, store]，可惰性初始化
// 5. 全局 Store
// ------------------------------------------------------------------
const globalStore = createStore({ count: 0, name: 'global' })

// 6. 组件通信 (Parent -> Child)
// ------------------------------------------------------------------

// Child: 接收 EnhancedStore，读用 snap、写用 store
function ChildComponent({ store }: { store: EnhancedStore<MyState> }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={() => store.count++}>+1</button>
      <button onClick={() => store.set('name', 'child')}>Change Name</button>
      <button onClick={() => store.reset({ count: 0, name: 'reset' })}>Reset</button>
    </div>
  )
}

// Parent: useStore 得 [snap, store]，把 store 传给子
function ParentComponent() {
  const [snap, store] = useStore({ count: 10, name: 'parent' })
  return <ChildComponent store={store} />
}

// 7. 常见错误：勿传普通对象给 useSnapshot/subscribe；集合勿用 key 名 "set"；派生须纯函数
`,
  en: `import { type EnhancedStore, createStore, useStore } from '@empjs/valtio'

// 1. Read/Write Loop (must follow): Read from snap, write via store; never read store.xxx for render
//    History store: read snap.value.xxx, write store.value.xxx; undo/redo via snap.undo()/snap.redo()
// ------------------------------------------------------------------

// 2. Types: Use EnhancedStore<T> (do not hand-write interface MyStore)
// ------------------------------------------------------------------
type MyState = { count: number; name: string }
type MyStore = EnhancedStore<MyState>

// 3. Choice: Singleton/cross-component → createStore; per-instance in component → useStore
// 4. Regular Store: createStore module-level; useStore returns [snap, store], supports lazy init
// 5. Global Store
// ------------------------------------------------------------------
const globalStore = createStore({ count: 0, name: 'global' })

// 6. Parent → Child
// ------------------------------------------------------------------

// Child: Receives EnhancedStore, read from snap, write via store
function ChildComponent({ store }: { store: EnhancedStore<MyState> }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={() => store.count++}>+1</button>
      <button onClick={() => store.set('name', 'child')}>Change Name</button>
      <button onClick={() => store.reset({ count: 0, name: 'reset' })}>Reset</button>
    </div>
  )
}

// Parent: useStore returns [snap, store], pass store to child
function ParentComponent() {
  const [snap, store] = useStore({ count: 10, name: 'parent' })
  return <ChildComponent store={store} />
}

// 7. Pitfalls: Pass proxy to useSnapshot/subscribe; do not use state key "set"; derive must be pure
`,
}

export const getBestPracticesSnippet = (locale: Locale) => snippets[locale]
