import type {Locale} from 'src/i18n/translations'

export type BestPracticesSection = 'callFlowAndUsage' | 'commonPitfalls'

const callFlowAndUsage: Record<Locale, string> = {
  zh: `import { type EmpStore, createStore, useStore } from '@empjs/valtio'

// 1. 调用闭环（必守）：读 snap，写 store
// ------------------------------------------------------------------
const store = createStore({ count: 0, name: '' })
const snap = store.useSnapshot()
// 读：只用 snap 做渲染
return <span>{snap.count}</span>
// 写：用 store 方法
store.set('count', snap.count + 1)
store.update({ name: 'Alice' })

// 历史 store：读 snap.value，写 store.value；撤销/重做 snap.undo() / snap.redo()


// 2. 类型：EmpStore<T>，不手写接口
// ------------------------------------------------------------------
type MyState = { count: number; name: string }
type MyStore = EmpStore<MyState>


// 1.2 局部 Store：组件隔离 + 传导方法
// ------------------------------------------------------------------
// 每实例独立 useStore，状态互不干扰；store 为 EmpStore，传导方法：useSnapshot / set / update / reset
function LocalInstance({ initialLabel }: { initialLabel: string }) {
  const [snap, store] = useStore<{ count: number; label: string }>({ count: 0, label: initialLabel })
  return (
    <div>
      <p>{snap.label}: count={snap.count}</p>
      <button onClick={() => store.set('count', snap.count + 1)}>set count+1</button>
      <button onClick={() => store.update({ label: snap.label + '-' })}>update label</button>
      <button onClick={() => store.reset({ count: 0, label: initialLabel })}>reset</button>
    </div>
  )
}
// 使用：<LocalInstance initialLabel="A" /> <LocalInstance initialLabel="B" /> 两实例互不干扰


// 3. 选型：单例/跨组件 → createStore；组件内每实例 → useStore
// ------------------------------------------------------------------
const globalStore = createStore({ count: 0, name: 'global' })
const [snap, localStore] = useStore(() => ({ count: 0 }))


// 4. 常规 + 5. 全局 + 6. 组件通信（Parent → Child）
// ------------------------------------------------------------------
function ChildComponent({ store }: { store: EmpStore<MyState> }) {
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

function ParentComponent() {
  const [snap, store] = useStore({ count: 10, name: 'parent' })
  return <ChildComponent store={store} />
}
`,
  en: `import { type EmpStore, createStore, useStore } from '@empjs/valtio'

// 1. Call flow (required): read snap, write store
// ------------------------------------------------------------------
const store = createStore({ count: 0, name: '' })
const snap = store.useSnapshot()
// Read: use only snap for render
return <span>{snap.count}</span>
// Write: use store methods
store.set('count', snap.count + 1)
store.update({ name: 'Alice' })

// History store: read snap.value, write store.value; undo/redo snap.undo() / snap.redo()


// 2. Types: EmpStore<T>, do not hand-write interfaces
// ------------------------------------------------------------------
type MyState = { count: number; name: string }
type MyStore = EmpStore<MyState>


// 1.2 Local Store: component isolation + conduction methods
// ------------------------------------------------------------------
// Each instance uses useStore independently; store is EmpStore: useSnapshot / set / update / reset
function LocalInstance({ initialLabel }: { initialLabel: string }) {
  const [snap, store] = useStore<{ count: number; label: string }>({ count: 0, label: initialLabel })
  return (
    <div>
      <p>{snap.label}: count={snap.count}</p>
      <button onClick={() => store.set('count', snap.count + 1)}>set count+1</button>
      <button onClick={() => store.update({ label: snap.label + '-' })}>update label</button>
      <button onClick={() => store.reset({ count: 0, label: initialLabel })}>reset</button>
    </div>
  )
}
// Usage: <LocalInstance initialLabel="A" /> <LocalInstance initialLabel="B" /> — instances are isolated


// 3. Choice: singleton/cross-component → createStore; per-instance → useStore
// ------------------------------------------------------------------
const globalStore = createStore({ count: 0, name: 'global' })
const [snap, localStore] = useStore(() => ({ count: 0 }))


// 4. Regular + 5. Global + 6. Component communication (Parent → Child)
// ------------------------------------------------------------------
function ChildComponent({ store }: { store: EmpStore<MyState> }) {
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

function ParentComponent() {
  const [snap, store] = useStore({ count: 10, name: 'parent' })
  return <ChildComponent store={store} />
}
`,
}

const commonPitfalls: Record<Locale, string> = {
  zh: `import { createStore, createMap, createSet } from '@empjs/valtio'

// 7. 常见错误与注意点
// ------------------------------------------------------------------

// 错误 1："Please use proxy object"
// 传给 useSnapshot / subscribe 的必须是 proxy（createStore/useStore 返回的 store），不要传普通对象
const snap = store.useSnapshot()        // OK: store 是 proxy
const snapBad = snapshot(plainObject)   // BAD: plainObject 不是 proxy


// 错误 2：派生函数签名与副作用
// derive: (get, proxy) => derivedObject，get(proxy) 得当前快照，返回纯对象，不要写副作用
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }  // 返回纯对象，无副作用
)


// 错误 3：集合 key 名勿用 "set"
// 会与 store.set(key, value) 方法冲突
const store = createStore({
  map: createMap(),
  // set: createSet(),  // BAD: 与 store.set 冲突
  tagSet: createSet(),  // OK
})
`,
  en: `import { createStore, createMap, createSet } from '@empjs/valtio'

// 7. Common pitfalls
// ------------------------------------------------------------------

// Pitfall 1: "Please use proxy object"
// Pass only proxy (store from createStore/useStore) to useSnapshot/subscribe, not plain objects
const snap = store.useSnapshot()        // OK: store is proxy
const snapBad = snapshot(plainObject)   // BAD: plainObject is not proxy


// Pitfall 2: Derive signature and side effects
// derive: (get, proxy) => derivedObject; get(proxy) gives current snapshot; return plain object, no side effects
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }  // plain object, no side effects
)


// Pitfall 3: Do not use key name "set" for collections
// Conflicts with store.set(key, value)
const store = createStore({
  map: createMap(),
  // set: createSet(),  // BAD: conflicts with store.set
  tagSet: createSet(),  // OK
})
`,
}

const snippetsBySection: Record<BestPracticesSection, Record<Locale, string>> = {
  callFlowAndUsage,
  commonPitfalls,
}

export function getBestPracticesSnippet(locale: Locale, section?: BestPracticesSection): string {
  if (section) return snippetsBySection[section][locale]
  return callFlowAndUsage[locale]
}
