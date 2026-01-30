import {useStore} from '@empjs/valtio'

function LocalCounterCard({title}: {title: string}) {
  const [snap, store] = useStore(() => ({
    count: 0,
    name: '',
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    setName(name: string) {
      this.name = name
    },
  }))

  return (
    <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-sm dark:border-emerald-600 dark:bg-slate-800 dark:text-slate-100">
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-300">Count: {snap.count}</p>
      <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">Name: {snap.name || '(empty)'}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => store.increment()}
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => store.decrement()}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
        >
          -1
        </button>
      </div>
      <input
        value={snap.name}
        onChange={e => store.setName(e.target.value)}
        placeholder="Enter name"
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
      />
    </div>
  )
}

export function LocalCounterDemo() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-2 text-lg font-semibold">局部状态</h2>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        每个 Counter 使用 useStore 工厂函数，各自独立 store，互不影响
      </p>
      <div className="flex flex-wrap gap-4">
        <LocalCounterCard title="Counter A" />
        <LocalCounterCard title="Counter B" />
        <LocalCounterCard title="Counter C" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
        {`const [snap, store] = useStore(() => ({ count: 0, ... }));
// 每个组件实例独立 store`}
      </pre>
    </section>
  )
}
