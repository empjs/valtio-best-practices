import React, {useState} from 'react'
import {CounterStore, globalCounterStore} from '../stores/CounterStore'

export function CloneDemo() {
  const [snap, store] = CounterStore.use(globalCounterStore)
  const [clonedSnap, setClonedSnap] = useState<{count: number; name: string} | null>(null)
  const [clonedStore, setClonedStore] = useState<InstanceType<typeof CounterStore> | null>(null)

  const handleClone = () => {
    const cloned = store.clone()
    setClonedStore(cloned)
    setClonedSnap(cloned.getSnapshot() as {count: number; name: string})
  }

  return (
    <div className="p-5 bg-teal-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">克隆 clone</h3>
      <p className="text-sm text-gray-600 mb-4">store.clone() 深拷贝当前快照并生成新的 store 实例，与原 store 独立</p>

      <div className="p-4 border-2 border-teal-500 m-2.5 rounded shadow-sm bg-white space-y-4">
        <div>
          <h4 className="font-bold text-gray-700 mb-1">原 store</h4>
          <p className="text-gray-800">
            Count: {snap.count} Name: {snap.name || '(empty)'}
          </p>
          <button
            type="button"
            onClick={() => store.increment()}
            className="mt-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
          >
            +1
          </button>
        </div>
        <button
          type="button"
          onClick={handleClone}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          克隆当前状态
        </button>
        {clonedStore && clonedSnap && (
          <div>
            <h4 className="font-bold text-gray-700 mb-1">克隆出的 store（独立）</h4>
            <p className="text-gray-800">
              Count: {clonedSnap.count} Name: {clonedSnap.name || '(empty)'}
            </p>
            <button
              type="button"
              onClick={() => {
                clonedStore.increment()
                setClonedSnap(clonedStore.getSnapshot() as {count: number; name: string})
              }}
              className="mt-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
            >
              +1（仅改克隆）
            </button>
          </div>
        )}
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <strong className="block mb-2 text-gray-700">代码：</strong>
          <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
            {`const cloned = store.clone();
// cloned 与 store 独立，修改 cloned 不影响原 store
// cloned.toJSON() 与克隆时刻的 store 快照一致`}
          </pre>
        </div>
      </div>
    </div>
  )
}
