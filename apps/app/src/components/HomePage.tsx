import React from 'react'
import {Link} from 'wouter'

export function HomePage() {
  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        选择下方入口查看对应 Demo：已有用法一页、高性能一页、其他 API（Map/Set、持久化、克隆）一页。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/basics">
          <a className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
            <span className="font-semibold text-blue-800">已有 Demo</span>
            <p className="text-sm text-blue-600 mt-1">局部/全局、历史、派生、异步、混合</p>
          </a>
        </Link>
        <Link href="/perf">
          <a className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition">
            <span className="font-semibold text-purple-800">高性能</span>
            <p className="text-sm text-purple-600 mt-1">ref、batch、subscribeKey 细粒度订阅</p>
          </a>
        </Link>
        <Link href="/more">
          <a className="block p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition">
            <span className="font-semibold text-orange-800">其他</span>
            <p className="text-sm text-orange-600 mt-1">Map/Set、persist 持久化、clone 克隆</p>
          </a>
        </Link>
      </div>
    </div>
  )
}
