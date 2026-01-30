import React from 'react'
import {CounterStore} from '../stores/CounterStore'

// ============================================
// 场景 4: 带历史记录（局部）
// ============================================
function FormWithHistoryComponent({title}: {title: string}) {
  const [snap, store] = CounterStore.useWithHistory({count: 0, name: ''}, {limit: 10})

  return (
    <div className="p-4 border-2 border-purple-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-gray-800">Count: {snap.value.count}</p>
      <p className="text-gray-800">Name: {snap.value.name || '(empty)'}</p>

      <div className="flex gap-2 my-2">
        <button
          onClick={() => store.value.increment()}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          +1
        </button>
        <button
          onClick={() => store.value.decrement()}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          -1
        </button>
      </div>

      <input
        value={snap.value.name}
        onChange={e => store.value.setName(e.target.value)}
        placeholder="Enter name"
        className="w-full p-2 border border-gray-300 rounded mt-2 focus:ring-2 focus:ring-purple-400 outline-none"
      />

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => store.undo()}
          disabled={snap.history.index === 0}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Undo
        </button>
        <button
          onClick={() => store.redo()}
          disabled={snap.history.index === snap.history.nodes.length - 1}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Redo
        </button>
        <span className="ml-2 text-xs text-gray-500">
          {snap.history.index + 1} / {snap.history.nodes.length}
        </span>
      </div>
    </div>
  )
}

export function HistoryDemo() {
  return (
    <div className="p-5 bg-purple-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">✅ 带历史记录（局部）</h3>
      <p className="text-sm text-gray-600 mb-4">每个表单独立的撤销/重做历史</p>

      <div className="flex flex-wrap gap-2.5">
        <FormWithHistoryComponent title="Form A" />
        <FormWithHistoryComponent title="Form B" />
      </div>

      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`function FormComponent() {
  const [snap, store] = CounterStore.useWithHistory(
    { count: 0, name: '' },
    { limit: 10 }
  );
  
  return (
    <div>
      <button onClick={() => store.value.increment()}>+1</button>
      <button onClick={() => store.undo()}>Undo</button>
      <button onClick={() => store.redo()}>Redo</button>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  )
}
