import React, {useEffect} from 'react'
import {CounterStore} from '../stores/CounterStore'

const PERSIST_KEY = 'valtio-demo-persist'

function PersistDemoInner() {
  const [snap, store] = CounterStore.use({count: 0, name: ''})

  useEffect(() => {
    return store.persist(PERSIST_KEY)
  }, [store])

  return (
    <div className="p-4 border-2 border-amber-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">持久化到 localStorage</h4>
      <p className="text-gray-800">Count: {snap.count}</p>
      <p className="text-gray-800">Name: {snap.name || '(empty)'}</p>
      <div className="flex gap-2 my-2">
        <button
          type="button"
          onClick={() => store.increment()}
          className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
        >
          +1
        </button>
        <input
          value={snap.name}
          onChange={e => store.setName(e.target.value)}
          placeholder="Enter name"
          className="w-full p-2 border border-gray-300 rounded mt-2 focus:ring-2 focus:ring-amber-400 outline-none"
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">刷新页面后状态会从 localStorage 恢复</p>
      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`const [snap, store] = CounterStore.use({ count: 0, name: '' });
useEffect(() => store.persist('valtio-demo-persist'), [store]);
// 变更会自动写入 localStorage，刷新后自动恢复`}
        </pre>
      </div>
    </div>
  )
}

export function PersistDemo() {
  return (
    <div className="p-5 bg-amber-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">持久化 persist</h3>
      <p className="text-sm text-gray-600 mb-4">store.persist(key) 订阅变化并写入 localStorage，初始化时从 key 恢复</p>
      <PersistDemoInner />
    </div>
  )
}
