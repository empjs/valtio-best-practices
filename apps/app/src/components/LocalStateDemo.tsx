import React from 'react'
import {LocalCounterComponent} from './LocalCounterComponent'

// 使用多个组件 - 状态完全隔离
export function LocalStateDemo() {
  return (
    <div className="p-5 bg-gray-100 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">✅ 局部状态模式 - 状态完全隔离</h3>
      <p className="text-sm text-gray-600 mb-4">每个 Counter 组件有独立的 store，互不影响</p>

      <div className="flex flex-wrap gap-2.5">
        <LocalCounterComponent title="Counter A" />
        <LocalCounterComponent title="Counter B" />
        <LocalCounterComponent title="Counter C" />
      </div>

      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`function LocalCounterComponent() {
  const [snap, store] = CounterStore.use();
  // 每个组件独立实例，状态隔离
  return <div onClick={() => store.increment()}>{snap.count}</div>;
}`}
        </pre>
      </div>
    </div>
  )
}
