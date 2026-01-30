import {useStoreWithHistory} from '@empjs/valtio'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

const codeImport = `import {
  createStoreWithHistory,
  useStoreWithHistory,
} from '@empjs/valtio'

// 全局历史: createStoreWithHistory(initialState, { limit: 50 })
// 局部历史: useStoreWithHistory(initialState, { limit: 50 })
`

const codeUsage = `function TodoWithUndo() {
  const [snap, store] = useStoreWithHistory(
    () => ({ text: '' }),
    { limit: 50 }
  )

  // 读状态用 snap.value（带历史包装后真实状态在 .value 里）
  const value = snap.value.text
  // 撤销/重做: store.undo() / store.redo()
  // 是否可撤销/重做: snap.isUndoEnabled / snap.isRedoEnabled

  return (
    <>
      <input value={value} onChange={e => (store.value.text = e.target.value)} />
      <button onClick={() => store.undo()} disabled={!snap.isUndoEnabled}>撤销</button>
      <button onClick={() => store.redo()} disabled={!snap.isRedoEnabled}>重做</button>
    </>
  )
}
`

export function WithHistory() {
  const [snap, store] = useStoreWithHistory(() => ({ count: 0 }), { limit: 10 })

  const demo = (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.value.count}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => (store.value.count = snap.value.count + 1)}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => store.undo()}
          disabled={!snap.isUndoEnabled}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
          aria-label="撤销"
        >
          撤销
        </button>
        <button
          type="button"
          onClick={() => store.redo()}
          disabled={!snap.isRedoEnabled}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
          aria-label="重做"
        >
          重做
        </button>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        withHistory
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        带撤销/重做的 store。snap.value 为当前状态，store.undo() / store.redo() 控制历史；适合可编辑内容、表单草稿等。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        用法要点
      </h2>
      <CodeBlock code={codeUsage} title="snap.value / undo / redo" />
    </PageWithDemo>
  )
}
