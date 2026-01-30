/**
 * 全局状态用例：多组件共享同一 store，状态同步
 */

import {createStore} from '@empjs/valtio'
import React from 'react'

const globalCounterStore = createStore(
  {
    count: 0,
    name: 'Global Store',
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    setName(name: string) {
      this.name = name
    },
  },
  {devtools: true, name: 'GlobalCounter'},
)

export function GlobalCounterCard({title}: {title: string}) {
  const snap = globalCounterStore.useSnapshot()

  return (
    <div className="rounded-xl border-2 border-blue-500 bg-white p-4 shadow-sm dark:border-blue-600 dark:bg-slate-800 dark:text-slate-100">
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-300">Count: {snap.count}</p>
      <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">Name: {snap.name}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => globalCounterStore.increment()}
          className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => globalCounterStore.decrement()}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
        >
          -1
        </button>
      </div>
      <input
        value={snap.name}
        onChange={e => globalCounterStore.setName(e.target.value)}
        placeholder="Enter name"
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
      />
    </div>
  )
}

export function GlobalCounterDemo() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-2 text-lg font-semibold">全局状态</h2>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        使用 createStore 在模块级创建单例，多个 Counter 共享同一 store，操作同步
      </p>
      <div className="flex flex-wrap gap-4">
        <GlobalCounterCard title="View A" />
        <GlobalCounterCard title="View B" />
        <GlobalCounterCard title="View C" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
        {`const store = createStore({ count: 0, ... });
function Component() {
  const snap = store.useSnapshot();
  return <div onClick={() => store.increment()}>{snap.count}</div>;
}`}
      </pre>
    </section>
  )
}
