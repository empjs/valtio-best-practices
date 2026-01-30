import React, {useEffect} from 'react'
import {PerfRefStore} from '../stores/PerfStore'

function PerfRefDemoInner() {
  const [snap, store] = PerfRefStore.use()

  useEffect(() => {
    if (store.bigData == null) {
      store.bigData = store.ref({value: 0})
    }
  }, [store])

  return (
    <div className="p-4 border-2 border-violet-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">ref：大对象不参与代理</h4>
      <p className="text-gray-800">
        count（代理字段）: <strong>{snap.count}</strong>
      </p>
      <p className="text-gray-800">
        bigData.value（ref 包裹）: <strong>{snap.bigData?.value ?? 0}</strong>
      </p>
      <p className="text-xs text-gray-500 mt-1">改 count 会重渲染；改 bigData.value 不会触发代理变更，故不重渲染</p>
      <div className="flex gap-2 my-2">
        <button
          type="button"
          onClick={() => store.set('count', snap.count + 1)}
          className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
        >
          +count
        </button>
        <button
          type="button"
          onClick={() => {
            if (store.bigData) store.bigData.value++
          }}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          +bigData.value
        </button>
      </div>
      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`store.bigData = store.ref({ value: 0 });
// ref 包裹后该对象不参与代理，修改 bigData.value 不触发订阅/重渲染
// 适合大对象、不变数据，减少内存与订阅粒度`}
        </pre>
      </div>
    </div>
  )
}

export function PerfRefDemo() {
  return (
    <div className="p-5 bg-violet-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">ref：大对象不参与代理</h3>
      <p className="text-sm text-gray-600 mb-4">
        store.ref(value) 标记后不深度代理，修改不触发订阅，适合大对象或不变数据
      </p>
      <PerfRefDemoInner />
    </div>
  )
}
