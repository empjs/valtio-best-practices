import ValtioStore, {useSnapshot} from '@empjs/valtio-store'
import React, {useMemo} from 'react'

function MapSetDemoInner() {
  const map = useMemo(
    () =>
      ValtioStore.createMap<number>([
        ['a', 1],
        ['b', 2],
      ]),
    [],
  )
  const set = useMemo(() => ValtioStore.createSet<number>([1, 2, 3]), [])
  const mapSnap = useSnapshot(map)
  const setSnap = useSnapshot(set)

  const mapEntries = Array.from(mapSnap.entries())
  const setValues = Array.from(setSnap.values())

  return (
    <div className="p-4 border-2 border-indigo-500 m-2.5 rounded shadow-sm bg-white space-y-4">
      <h4 className="text-lg font-bold mb-2">Map / Set</h4>
      <div>
        <p className="text-gray-700 text-sm font-medium mb-1">Map 键值（可增删改）</p>
        <div className="flex flex-wrap gap-2 items-center">
          {mapEntries.map(([k, v]) => (
            <span key={k} className="px-2 py-1 bg-gray-100 rounded text-sm">
              {k}: {v}
            </span>
          ))}
          <button
            type="button"
            onClick={() => map.set('c', ((map.get('c') as number | undefined) ?? 0) + 1)}
            className="px-2 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
          >
            +c
          </button>
          <button
            type="button"
            onClick={() => map.delete('a')}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            删 a
          </button>
        </div>
      </div>
      <div>
        <p className="text-gray-700 text-sm font-medium mb-1">Set 集合（可增删）</p>
        <div className="flex flex-wrap gap-2 items-center">
          {setValues.map(n => (
            <span key={n} className="px-2 py-1 bg-gray-100 rounded text-sm">
              {n}
            </span>
          ))}
          <button
            type="button"
            onClick={() => set.add(Math.max(0, ...setValues) + 1)}
            className="px-2 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => setValues.length > 0 && set.delete(setValues[0])}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            删首项
          </button>
        </div>
      </div>
      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`const map = ValtioStore.createMap([['a', 1], ['b', 2]]);
const set = ValtioStore.createSet([1, 2, 3]);
const mapSnap = useSnapshot(map);
const setSnap = useSnapshot(set);
// Map/Set 变化会触发组件重渲染`}
        </pre>
      </div>
    </div>
  )
}

export function MapSetDemo() {
  return (
    <div className="p-5 bg-indigo-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">Map / Set 集合状态</h3>
      <p className="text-sm text-gray-600 mb-4">createMap / createSet 可代理的集合，键值变化可被 useSnapshot 订阅</p>
      <MapSetDemoInner />
    </div>
  )
}
