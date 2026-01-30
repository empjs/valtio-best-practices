import React from 'react'
import {CounterStore, globalCounterStore} from '../stores/CounterStore'

export function GlobalCounterComponent({title}: {title: string}) {
  // ✅ 所有组件共享同一个 store
  const [snap, store] = CounterStore.use(globalCounterStore)

  return (
    <div className="p-4 border-2 border-blue-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-gray-800">Count: {snap.count}</p>
      <p className="text-gray-800">Name: {snap.name}</p>
      <div className="flex gap-2 my-2">
        <button
          onClick={() => store.increment()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
        className="w-full p-2 border border-gray-300 rounded mt-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  )
}
