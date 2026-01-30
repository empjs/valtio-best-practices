import {demoStore} from '../stores/demoStore'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

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

/** 单个展示块：读同一全局 store，任意一处 +1 会同步到所有实例 */
function GlobalCounterBlock({ label }: { label: string }) {
  const snap = demoStore.useSnapshot()
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</p>
      <button
        type="button"
        onClick={() => demoStore.set('count', snap.count + 1)}
        className="rounded border border-slate-300 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
      >
        +1
      </button>
    </div>
  )
}

export function CreateStore() {
  const demo = (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        同一全局 store，多处组件订阅同一 count，任意一处 +1 会同步到所有实例。
      </p>
      <div className="flex flex-wrap gap-3">
        <GlobalCounterBlock label="实例 A" />
        <GlobalCounterBlock label="实例 B" />
        <GlobalCounterBlock label="实例 C" />
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        createStore
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        创建全局 store，单例跨组件共享。适合应用级状态（主题、用户、全局计数等）。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        签名
      </h2>
      <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
        createStore&lt;T&gt;(initialState: T, options?: &#123; devtools?: boolean; name?: string &#125;) → T &amp; StoreBaseMethods&lt;T&gt;
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        1. 定义 store
      </h2>
      <CodeBlock code={codeDefine} title="定义 store" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        2. 在组件中读取与更新
      </h2>
      <CodeBlock code={codeReadWrite} title="读取 / 更新" />
    </PageWithDemo>
  )
}
