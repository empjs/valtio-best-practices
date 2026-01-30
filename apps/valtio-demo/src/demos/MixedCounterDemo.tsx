/**
 * 混合用例：同一页面同时使用局部 store 与全局 store
 */

import {useStore} from '@empjs/valtio'
import React from 'react'
import {GlobalCounterCard} from './GlobalCounterDemo'

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

export function MixedCounterDemo() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-2 text-lg font-semibold">混合：局部 + 全局</h2>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        同一页面内部分区域用局部 store（各自独立），部分区域用全局 store（共享）
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">局部状态区域</h3>
          <div className="flex flex-wrap gap-4">
            <LocalCounterCard title="Local 1" />
            <LocalCounterCard title="Local 2" />
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">全局状态区域</h3>
          <div className="flex flex-wrap gap-4">
            <GlobalCounterCard title="Global 1" />
            <GlobalCounterCard title="Global 2" />
          </div>
        </div>
      </div>
    </section>
  )
}
