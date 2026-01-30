import React, {useEffect, useState} from 'react'
import {PerfFineGrainedStore} from '../stores/PerfStore'

const globalPerfStore = PerfFineGrainedStore.create({count: 0, name: ''})

function PerfFineGrainedDemoInner() {
  const [snap, store] = PerfFineGrainedStore.use(globalPerfStore)
  const [countLog, setCountLog] = useState<number[]>([])

  useEffect(() => {
    const unsub = store.subscribeKey('count', value => {
      setCountLog(prev => [...prev, value as number].slice(-5))
    })
    return unsub
  }, [store])

  return (
    <div className="p-4 border-2 border-violet-700 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">subscribeKey：只订阅单个 key</h4>
      <p className="text-gray-800">
        count: <strong>{snap.count}</strong>（useSnapshot 整 store）
      </p>
      <p className="text-gray-800">
        name: <strong>{snap.name || '(empty)'}</strong>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        下方「仅 count 变化时的回调」由 subscribeKey('count') 驱动，改 name 不会追加
      </p>
      <p className="text-gray-700 text-sm mt-2">仅 count 变化时的回调记录: [{countLog.join(', ')}]</p>
      <div className="flex gap-2 my-2 flex-wrap">
        <button
          type="button"
          onClick={() => store.increment()}
          className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
        >
          +count
        </button>
        <input
          value={snap.name}
          onChange={e => store.set('name', e.target.value)}
          placeholder="改 name"
          className="p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`store.subscribeKey('count', value => { ... });
// 仅在该 key 变化时触发回调，非 React 场景可驱动局部 state，减少无效触发
// 与 useSnapshot(store) 整 store 订阅对比`}
        </pre>
      </div>
    </div>
  )
}

export function PerfFineGrainedDemo() {
  return (
    <div className="p-5 bg-violet-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">subscribeKey：细粒度订阅</h3>
      <p className="text-sm text-gray-600 mb-4">只订阅单个 key 的变化，减少无效触发，非 React 场景可驱动局部 state</p>
      <PerfFineGrainedDemoInner />
    </div>
  )
}
