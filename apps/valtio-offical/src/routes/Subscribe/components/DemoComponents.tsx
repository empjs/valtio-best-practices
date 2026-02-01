import {type EnhancedStore} from '@empjs/valtio'
import {useRef} from 'react'

const cardChip =
  'rounded border border-gray-200 bg-white px-2 py-1 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

/** 只读 count，用于演示细粒度：改 name 时此组件不重渲染 */
export function OnlyCount({
  store,
  renderLabel,
}: {
  store: EnhancedStore<{count: number; name: string}>
  renderLabel: string
}) {
  const snap = store.useSnapshot()
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div className={cardChip}>
      <span className="tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</span>
      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
        {renderLabel}
        {renderCount.current}
      </span>
    </div>
  )
}

/** 只读 name，用于演示细粒度：改 count 时此组件不重渲染 */
export function OnlyName({
  store,
  renderLabel,
}: {
  store: EnhancedStore<{count: number; name: string}>
  renderLabel: string
}) {
  const snap = store.useSnapshot()
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div className={cardChip}>
      <span className="text-slate-900 dark:text-slate-100">name: {snap.name}</span>
      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
        {renderLabel}
        {renderCount.current}
      </span>
    </div>
  )
}
