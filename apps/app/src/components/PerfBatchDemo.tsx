import React, {useState} from 'react'
import {PerfBatchStore} from '../stores/PerfStore'

let renderCount = 0

function PerfBatchDemoInner() {
  const [snap, store] = PerfBatchStore.use()
  const [, setTick] = useState(0)
  renderCount++
  const currentRenderCount = renderCount

  const updateSeparately = () => {
    store.set('a', snap.a + 1)
    store.set('b', snap.b + 1)
    setTick(t => t + 1)
  }

  const updateBatched = () => {
    store.batch(s => {
      s.set('a', snap.a + 1)
      s.set('b', snap.b + 1)
    })
    setTick(t => t + 1)
  }

  return (
    <div className="p-4 border-2 border-violet-600 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">batch：批量更新</h4>
      <p className="text-gray-800">
        a: {snap.a}, b: {snap.b}
      </p>
      <p className="text-xs text-gray-500 mt-1">本组件渲染次数: {currentRenderCount}</p>
      <div className="flex gap-2 my-2">
        <button
          type="button"
          onClick={updateSeparately}
          className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
        >
          分两次 set
        </button>
        <button
          type="button"
          onClick={updateBatched}
          className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
        >
          batch 一次更新
        </button>
      </div>
      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`store.batch(s => {
  s.set('a', 1);
  s.set('b', 2);
});
// 批量更新包一层，便于与外部批量逻辑对齐，减少中间渲染`}
        </pre>
      </div>
    </div>
  )
}

export function PerfBatchDemo() {
  return (
    <div className="p-5 bg-violet-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">batch：批量更新</h3>
      <p className="text-sm text-gray-600 mb-4">store.batch(fn) 包一层多次更新，便于调试或与外部批量逻辑对齐</p>
      <PerfBatchDemoInner />
    </div>
  )
}
