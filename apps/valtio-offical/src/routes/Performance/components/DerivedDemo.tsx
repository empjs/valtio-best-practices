import {derive, useSnapshot, useStore} from '@empjs/valtio'
import {useMemo} from 'react'
import {useT} from 'src/i18n'

export function DerivedDemo() {
  const t = useT()
  const [baseSnap, baseStore] = useStore(() => ({
    filter: '',
    items: Array.from({length: 1000}, (_, i) => `Item ${i}`),
  }))

  // Use derive to cache the filtered result
  // Must use useMemo to ensure derive is called only once per store instance
  const derivedStore = useMemo(() => {
    return derive(
      {
        filtered: get => {
          const f = get(baseStore).filter.toLowerCase()
          const list = get(baseStore).items
          // Expensive simulation?
          return list.filter(i => i.toLowerCase().includes(f))
        },
      },
      {proxy: baseStore},
    )
  }, [baseStore])

  const derivedSnap = useSnapshot(derivedStore)

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('performance.s4Title')}</h3>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t('performance.s4Desc')}</p>
      <input
        value={baseSnap.filter}
        onChange={e => (baseStore.filter = e.target.value)}
        placeholder="Filter 1000 items..."
        className="mb-3 w-full rounded border border-slate-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
      />
      <div className="flex-1 overflow-auto rounded border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
        <div className="text-xs text-slate-500 mb-2">Count: {derivedSnap.filtered.length}</div>
        {derivedSnap.filtered.slice(0, 20).map(item => (
          <div key={item} className="text-xs text-slate-700 dark:text-slate-300">
            {item}
          </div>
        ))}
        {derivedSnap.filtered.length > 20 && <div className="text-xs text-slate-400">...</div>}
      </div>
    </div>
  )
}
