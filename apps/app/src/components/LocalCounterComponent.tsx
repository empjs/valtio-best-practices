import React from 'react'
import {CounterStore} from '../stores/CounterStore'

export function LocalCounterComponent({title}: {title: string}) {
  // ✅ 每个组件实例有独立的 store
  const [snap, store] = CounterStore.use()

  return (
    <div className="p-4 border-2 border-green-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-gray-800">Count: {snap.count}</p>
      <p className="text-gray-800">Name: {snap.name || '(empty)'}</p>
      <div className="flex gap-2 my-2">
        <button
          onClick={() => store.increment()}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          +1
        </button>
        <button
          onClick={() => store.decrement()}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          -1
        </button>
      </div>
      <input
        value={snap.name}
        onChange={e => store.setName(e.target.value)}
        placeholder="Enter name"
        className="w-full p-2 border border-gray-300 rounded mt-2 focus:ring-2 focus:ring-green-400 outline-none"
      />
    </div>
  )
}
