import React from 'react'
import {GlobalCounterComponent} from './GlobalCounterComponent'

export function GlobalStateDemo() {
  return (
    <div className="p-5 bg-blue-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">✅ 全局状态模式 - 所有组件同步</h3>
      <p className="text-sm text-gray-600 mb-4">所有 Counter 组件共享同一个 store，状态同步</p>

      <div className="flex flex-wrap gap-2.5">
        <GlobalCounterComponent title="View A" />
        <GlobalCounterComponent title="View B" />
        <GlobalCounterComponent title="View C" />
      </div>

      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`// 创建全局实例
const globalStore = CounterStore.createGlobal({ count: 0 });

function Component() {
  const [snap, store] = CounterStore.useGlobal(globalStore);
  // 所有组件共享同一个 store
  return <div onClick={() => store.increment()}>{snap.count}</div>;
}`}
        </pre>
      </div>
    </div>
  )
}
