import React from 'react'
import {GlobalCounterComponent} from './GlobalCounterComponent'
import {LocalCounterComponent} from './LocalCounterComponent'

// ============================================
// 场景 3: 混合模式 - 灵活控制
// ============================================
export function MixedDemo() {
  return (
    <div className="p-5 bg-orange-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">✅ 混合模式 - 局部 + 全局</h3>
      <p className="text-sm text-gray-600 mb-4">可以同时使用局部和全局状态，灵活组合</p>

      <div className="flex flex-wrap gap-2.5 items-start">
        <div className="flex-1 min-w-[300px]">
          <h4 className="font-semibold text-gray-700 mb-2 pl-2">局部状态区域</h4>
          <LocalCounterComponent title="Local 1" />
          <LocalCounterComponent title="Local 2" />
        </div>

        <div className="flex-1 min-w-[300px]">
          <h4 className="font-semibold text-gray-700 mb-2 pl-2">全局状态区域</h4>
          <GlobalCounterComponent title="Global 1" />
          <GlobalCounterComponent title="Global 2" />
        </div>
      </div>
    </div>
  )
}
