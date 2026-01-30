import {useStoreWithDerived} from '@empjs/valtio'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

const codeImport = `import {
  createStoreWithDerived,
  useStoreWithDerived,
} from '@empjs/valtio'

// deriveFn 的 get 返回 Snapshot<T>，派生结果类型 D 由返回值推导
`

const codeUsage = `const [baseSnap, baseStore, derivedSnap] = useStoreWithDerived(
  () => ({
    items: [{ price: 10 }, { price: 20 }],
  }),
  (get, base) => {
    const state = get(base)
    const total = state.items.reduce((sum, i) => sum + i.price, 0)
    return { total, count: state.items.length }
  }
)

// 读 base: baseSnap.items
// 读 derived: derivedSnap.total, derivedSnap.count（仅依赖用到的 base 时自动更新）
// 写: baseStore.update({ items: [...] })
`

export function WithDerived() {
  const [baseSnap, baseStore, derivedSnap] = useStoreWithDerived(
    () => ({ a: 1, b: 2 }),
    (get, base) => {
      const state = get(base)
      return { sum: state.a + state.b }
    },
  )

  const demo = (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>
      <p className="mb-1 tabular-nums text-slate-900 dark:text-slate-100">base: a={baseSnap.a}, b={baseSnap.b}</p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">derived.sum: {derivedSnap.sum}</p>
      <button
        type="button"
        onClick={() => baseStore.update({ a: baseSnap.a + 1 })}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
      >
        a+1
      </button>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        withDerived
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        基座 store + 派生状态。deriveFn(get, base) 中 get 返回 Snapshot&lt;T&gt;，返回的 D 类型自动推导；只读派生字段时细粒度更新。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        用法示例
      </h2>
      <CodeBlock code={codeUsage} title="base + derived" />
    </PageWithDemo>
  )
}
