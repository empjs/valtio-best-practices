import {useSnapshot, useStore} from '@empjs/valtio'
import {useRef} from 'react'
import {useT} from 'src/i18n'

interface FineGrainedItem {
  id: string
  count: number
  bg: string
}

export function FineGrainedDemo() {
  const t = useT()
  // Create multiple stores for items to show isolation OR use one store and show path subscription
  const [snap, store] = useStore(() => ({
    items: [
      {id: 'A', count: 0, bg: 'transparent'},
      {id: 'B', count: 0, bg: 'transparent'},
      {id: 'C', count: 0, bg: 'transparent'},
    ] as FineGrainedItem[],
  }))

  const inc = (idx: number) => {
    store.items[idx].count++
    // flash effect
    store.items[idx].bg = '#ecfccb' // lime-100
    setTimeout(() => {
      store.items[idx].bg = 'transparent'
    }, 200)
  }

  const incAll = () => {
    store.batch(s => {
      s.items.forEach(i => i.count++)
    })
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('performance.s2Title')}</h3>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t('performance.s2Desc')}</p>
      <button
        onClick={incAll}
        className="mb-3 w-full rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
      >
        Inc All (Batch)
      </button>
      <div className="flex flex-1 flex-col gap-2 overflow-auto rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900">
        {snap.items.map((_, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <button
              onClick={() => inc(idx)}
              className="rounded bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
            >
              +1
            </button>
            <ChildItem itemProxy={store.items[idx]} id={store.items[idx].id} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ChildItem({itemProxy, id}: {itemProxy: FineGrainedItem; id: string}) {
  const snap = useSnapshot(itemProxy)
  const renderCount = useRef(0)
  renderCount.current++
  return (
    <div
      className="flex-1 rounded border border-slate-200 bg-white p-2 text-xs shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800"
      style={{backgroundColor: snap.bg === 'transparent' ? undefined : snap.bg}}
    >
      <div className="flex justify-between">
        <span>
          {id}: {snap.count}
        </span>
        <span className="text-[10px] text-slate-400">R: {renderCount.current}</span>
      </div>
    </div>
  )
}
