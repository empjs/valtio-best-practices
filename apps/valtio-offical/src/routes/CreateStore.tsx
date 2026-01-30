import {createStore} from '@empjs/valtio'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'
import {demoStore} from '../stores/demoStore'

const codeImport = `import { createStore } from '@empjs/valtio'

// 类型由 initialState 推导，无需手写 Snapshot<T>
// 全局单例，多处组件可 store.useSnapshot() 或 useSnapshot(store) 订阅
`

const codeDefine = `// 1. 定义 store（通常在模块顶层或单独 stores/*.ts）
const store = createStore(
  { count: 0, name: '' },
  { name: 'MyStore', devtools: true }
)

// store 类型为 { count: number; name: string } & StoreBaseMethods<...>
// store.useSnapshot() 返回 Snapshot<{ count: number; name: string }>
`

const codeReadWrite = `// 2. 在组件中读取（只读 snap）
function Counter() {
  const snap = store.useSnapshot()
  // 或: const snap = useSnapshot(store)
  return <span>{snap.count}</span>
}

// 3. 在组件中更新（用 store 方法，key 受 keyof T 约束）
function Controls() {
  const snap = store.useSnapshot()
  return (
    <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    // 或批量: store.update({ count: snap.count + 1, name: 'x' })
  )
}
`

// 带历史的全局 store（用于本页 demo）
const historyStore = createStore({count: 0}, {history: {limit: 10}})

// 带派生的全局 store（用于本页 demo）
const derivedStore = createStore(
  {a: 1, b: 2},
  {
    derive: (get, base) => {
      const s = get(base)
      return {sum: s.a + s.b}
    },
  },
)

// 异步请求用全局 store（用于本页 demo）：异步方法写在 store 内，this 指向 store
const asyncStore = createStore(
  {
    user: null as {name: string} | null,
    loading: false,
    error: null as Error | null,
    loadUser() {
      this.loading = true
      this.error = null
      setTimeout(() => {
        this.user = {name: 'Alice'}
        this.loading = false
      }, 500)
    },
  },
  {name: 'AsyncStore'},
)

const btn =
  'cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900'

const cardInner =
  'rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

/** 单个展示块：读同一全局 store，任意一处 +1 会同步到所有实例 */
function GlobalCounterBlock({label}: {label: string}) {
  const snap = demoStore.useSnapshot()
  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</p>
      <button
        type="button"
        onClick={() => demoStore.set('count', snap.count + 1)}
        className="cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
      >
        +1
      </button>
    </div>
  )
}

/** 带历史的 createStore demo：读 snap.value，写 store.value，undo/redo */
function HistoryDemoBlock({label}: {label?: string}) {
  const snap = historyStore.useSnapshot()
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.value.count}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => (historyStore.value.count = snap.value.count + 1)} className={btn}>
          +1
        </button>
        <button
          type="button"
          onClick={() => historyStore.undo()}
          disabled={!snap.isUndoEnabled}
          className={btn}
          aria-label="撤销"
        >
          撤销
        </button>
        <button
          type="button"
          onClick={() => historyStore.redo()}
          disabled={!snap.isRedoEnabled}
          className={btn}
          aria-label="重做"
        >
          重做
        </button>
      </div>
    </div>
  )
}

/** 带派生的 createStore demo：base + derived（与普通用法一致：store.useSnapshot()） */
function DerivedDemoBlock({label}: {label?: string}) {
  const baseSnap = derivedStore.base.useSnapshot()
  const derivedSnap = derivedStore.derived.useSnapshot()
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-1 tabular-nums text-slate-900 dark:text-slate-100">
        base: a={baseSnap.a}, b={baseSnap.b}
      </p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">derived.sum: {derivedSnap.sum}</p>
      <button type="button" onClick={() => derivedStore.base.update({a: baseSnap.a + 1})} className={btn}>
        a+1
      </button>
    </div>
  )
}

/** 异步请求（全局 store）demo：异步方法在 store 内，推荐 store.useSnapshot() */
function AsyncDemoBlock() {
  const snap = asyncStore.useSnapshot()

  if (snap.loading) return <p className="text-slate-500">Loading…</p>
  if (snap.error)
    return (
      <p className="text-red-600" role="alert">
        Error: {snap.error.message}
      </p>
    )
  return (
    <div className={cardInner}>
      <p className="mb-2 text-slate-900 dark:text-slate-100">{snap.user ? `user: ${snap.user.name}` : '未加载'}</p>
      <button type="button" onClick={() => asyncStore.loadUser()} className={btn}>
        {snap.user ? '重新加载' : '加载用户'}
      </button>
    </div>
  )
}

const codeHistory = `// 带历史：options.history，返回的 store 有 .value、.undo()、.redo()
const store = createStore(
  { count: 0 },
  { history: { limit: 50 } }
)
// 读: snap.value.count（useSnapshot(store) 得到 snap）
// 写: store.value.count = x
// 撤销/重做: store.undo() / store.redo()
// snap.isUndoEnabled / snap.isRedoEnabled 控制按钮禁用
`

const codeDerived = `// 带派生：options.derive，返回 { base, derived }
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b }) }
)
// 组件内: useSnapshot(base) 读 base，useSnapshot(derived) 读派生
// 写: base.update({ a: 2 })
`

const codeAsync = `// 异步请求：用常规 createStore + 手动 loading/error
const store = createStore({
  user: null as User | null,
  loading: false,
  error: null as Error | null,
})
// 请求前: store.update({ loading: true, error: null })
// 成功: store.update({ user, loading: false })
// 失败: store.update({ error, loading: false })
`

export function CreateStore() {
  const demo = (
    <section
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">1. 常规 createStore</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          同一全局 store，多处组件订阅同一 count，任意一处 +1 会同步到所有实例。
        </p>
        <div className="flex gap-3">
          <div className="min-w-0 w-1/3">
            <GlobalCounterBlock label="实例 A" />
          </div>
          <div className="min-w-0 w-1/3">
            <GlobalCounterBlock label="实例 B" />
          </div>
          <div className="min-w-0 w-1/3">
            <GlobalCounterBlock label="实例 C" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">2. 带历史的 createStore</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          同一全局 store，两处组件订阅同一 count，任意一处操作会同步到另一实例。
        </p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <HistoryDemoBlock label="实例 A" />
          </div>
          <div className="min-w-0 flex-1">
            <HistoryDemoBlock label="实例 B" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">3. 带派生的 createStore</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          同一全局 store（base + derived），两处组件订阅，任意一处修改 a 会同步派生 sum。
        </p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <DerivedDemoBlock label="实例 A" />
          </div>
          <div className="min-w-0 flex-1">
            <DerivedDemoBlock label="实例 B" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">4. 异步请求（全局 store）</h3>
        <AsyncDemoBlock />
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-[#4C1D95] dark:text-slate-100">createStore</h1>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        创建全局 store，单例跨组件共享。支持常规、带历史、带派生；异步请求用常规 store + 手动 loading/error。
      </p>

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">如何导入</h2>
      <CodeBlock code={codeImport} title="导入" />

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">签名</h2>
      <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        createStore(initialState, options?) → store 或 &#123; base, derived &#125;（options 含 history 或 derive 时）
      </p>

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">1. 定义 store（常规）</h2>
      <CodeBlock code={codeDefine} title="定义 store" />

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">2. 在组件中读取与更新</h2>
      <CodeBlock code={codeReadWrite} title="读取 / 更新" />

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">3. 带历史的 createStore</h2>
      <CodeBlock code={codeHistory} title="options.history" />

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">4. 带派生的 createStore</h2>
      <CodeBlock code={codeDerived} title="options.derive" />

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">
        5. 异步请求（常规 store + 手动 loading/error）
      </h2>
      <CodeBlock code={codeAsync} title="异步请求" />
    </PageWithDemo>
  )
}
