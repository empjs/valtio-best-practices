import {createMap, createSet, useStore} from '@empjs/valtio'
import {useMemo} from 'react'
import {collectionsStore} from 'src/routes/Collections/demos.store'

const btn =
  'cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

const cardInner =
  'min-w-0 rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

// ========== Map Scenarios ==========

export function GlobalMapBlock({label}: {label: string}) {
  const snap = collectionsStore.useSnapshot()
  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const mapSize = snap.map.size

  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label} (Global)</p>
      <p
        className="mb-2 truncate text-xs text-slate-900 dark:text-slate-100"
        title={`Map (${mapSize}): ${mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}`}
      >
        Map ({mapSize}): {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => collectionsStore.map.set('c', (snap.map.get('c') ?? 0) + 1)}
          className={btn}
        >
          map.set('c', n+1)
        </button>
        <button type="button" onClick={() => collectionsStore.map.set('a', 1)} className={btn}>
          map.set('a', 1)
        </button>
        <button
          type="button"
          onClick={() => (snap.map.has('a') ? collectionsStore.map.delete('a') : null)}
          className={btn}
        >
          map.delete('a')
        </button>
      </div>
    </div>
  )
}

export function LocalMapBlock({label}: {label: string}) {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
  }))
  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const mapSize = snap.map.size

  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label} (Local)</p>
      <p
        className="mb-2 truncate text-xs text-slate-900 dark:text-slate-100"
        title={`Map (${mapSize}): ${mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}`}
      >
        Map ({mapSize}): {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.map.set('c', (snap.map.get('c') ?? 0) + 1)} className={btn}>
          map.set('c', n+1)
        </button>
        <button type="button" onClick={() => store.map.set('a', 1)} className={btn}>
          map.set('a', 1)
        </button>
        <button type="button" onClick={() => (snap.map.has('a') ? store.map.delete('a') : null)} className={btn}>
          map.delete('a')
        </button>
      </div>
    </div>
  )
}

// ========== Set Scenarios ==========

export function GlobalSetBlock({label}: {label: string}) {
  const snap = collectionsStore.useSnapshot()
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])
  const setSize = snap.tagSet.size

  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label} (Global)</p>
      <p
        className="mb-2 truncate text-xs text-slate-900 dark:text-slate-100"
        title={`Set ({setSize}): ${setValues.join(', ') || '—'}`}
      >
        Set ({setSize}): {setValues.join(', ') || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => collectionsStore.tagSet.add('y')} className={btn}>
          tagSet.add('y')
        </button>
        <button type="button" onClick={() => collectionsStore.tagSet.add('x')} className={btn}>
          tagSet.add('x')
        </button>
        <button type="button" onClick={() => collectionsStore.tagSet.delete('x')} className={btn}>
          tagSet.delete('x')
        </button>
      </div>
    </div>
  )
}

export function LocalSetBlock({label}: {label: string}) {
  const [snap, store] = useStore(() => ({
    tagSet: createSet<string>(['x']),
  }))
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])
  const setSize = snap.tagSet.size

  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label} (Local)</p>
      <p
        className="mb-2 truncate text-xs text-slate-900 dark:text-slate-100"
        title={`Set ({setSize}): ${setValues.join(', ') || '—'}`}
      >
        Set ({setSize}): {setValues.join(', ') || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.tagSet.add('y')} className={btn}>
          tagSet.add('y')
        </button>
        <button type="button" onClick={() => store.tagSet.add('x')} className={btn}>
          tagSet.add('x')
        </button>
        <button type="button" onClick={() => store.tagSet.delete('x')} className={btn}>
          tagSet.delete('x')
        </button>
      </div>
    </div>
  )
}
