import {useStore} from '@empjs/valtio'
import {useT} from 'src/i18n'

const INITIAL_COUNT = 500

function genItems(start: number, count: number): {id: number; text: string; done: boolean}[] {
  return Array.from({length: count}, (_, i) => ({
    id: start + i,
    text: `Item ${start + i}`,
    done: false,
  }))
}

export function LongListDemo() {
  const t = useT()
  const [snap, store] = useStore(() => ({
    items: genItems(0, INITIAL_COUNT),
  }))

  const addMany = (n: number) => {
    store.batch(s => {
      const start = s.items.length
      for (let i = 0; i < n; i++) {
        s.items.push({id: start + i, text: `Item ${start + i}`, done: false})
      }
    })
  }

  const removeFirst = (n: number) => {
    store.batch(s => {
      s.items.splice(0, n)
    })
  }

  const toggleAll = (done: boolean) => {
    store.batch(s => {
      s.items.forEach(item => {
        item.done = done
      })
    })
  }

  const toggleOne = (id: number) => {
    const item = store.items.find(i => i.id === id)
    if (item) item.done = !item.done
  }

  const allDone = snap.items.length > 0 && snap.items.every(item => item.done)

  const btn =
    'cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('performance.s1Title')}</h3>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        {t('performance.s1Desc')}{' '}
        <span className="tabular-nums font-medium text-slate-600 dark:text-slate-300">({snap.items.length})</span>
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addMany(100)}
          className={btn}
          title={t('performance.add100')}
          aria-label={t('performance.add100')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => removeFirst(100)}
          disabled={snap.items.length === 0}
          className={btn}
          title={t('performance.remove100')}
          aria-label={t('performance.remove100')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
        <button type="button" onClick={() => toggleAll(!allDone)} disabled={snap.items.length === 0} className={btn}>
          {allDone ? t('performance.deselectAll') : t('performance.selectAll')}
        </button>
      </div>
      <div
        className="flex-1 min-h-[200px] max-h-80 overflow-auto rounded border border-blue-200/60 bg-blue-50/80 dark:border-blue-800/50 dark:bg-blue-950/50"
        style={{contain: 'layout style'}}
      >
        {snap.items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-2 border-b border-slate-100 px-2 py-1.5 dark:border-slate-700"
            style={{contentVisibility: 'auto'}}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleOne(item.id)}
              className="rounded border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400"
            />
            <span className="w-12 shrink-0 tabular-nums text-xs text-slate-500 dark:text-slate-400">{item.id}</span>
            <span className="min-w-0 truncate text-xs text-slate-900 dark:text-slate-100">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
