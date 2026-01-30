import {useStore} from '@empjs/valtio'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

const codeImport = `import { useStore } from '@empjs/valtio'

// 每个组件实例拥有独立 store，[snap, store] 类型由 initialState 推导
`

const codeUsage = `function LocalCounter() {
  // 惰性初始化也可: useStore(() => ({ count: 0 }))
  const [snap, store] = useStore({ count: 0 })

  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    </div>
  )
}

// 两个 <LocalCounter /> 各自维护自己的 count，互不影响
`

const codeWhen = `// 何时用 createStore vs useStore
// - 单例、跨组件共享 → createStore
// - 组件内独立状态、每实例一份 → useStore
`

/** 每个实例内部 useStore，拥有独立 count，互不影响 */
function LocalCounterBlock({ label }: { label: string }) {
  const [snap, store] = useStore({ count: 0 })
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</p>
      <button
        type="button"
        onClick={() => store.set('count', snap.count + 1)}
        className="rounded border border-slate-300 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
      >
        +1
      </button>
    </div>
  )
}

export function UseStore() {
  const demo = (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        每个实例内部 useStore，各自维护自己的 count，互不影响。
      </p>
      <div className="flex flex-wrap gap-3">
        <LocalCounterBlock label="实例 A" />
        <LocalCounterBlock label="实例 B" />
        <LocalCounterBlock label="实例 C" />
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        useStore
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        在组件内创建局部 store，返回 [snap, store]。每个组件实例独立，适合表单、弹窗内部状态等。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        签名
      </h2>
      <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
        useStore&lt;T&gt;(initialState: T | () =&gt; T) → [Snapshot&lt;T&gt;, T &amp; StoreBaseMethods&lt;T&gt;]
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        用法示例
      </h2>
      <CodeBlock code={codeUsage} title="组件内使用" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        何时用
      </h2>
      <CodeBlock code={codeWhen} title="选用场景" />
    </PageWithDemo>
  )
}
