import {useStore} from '@empjs/valtio'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'
import {useT} from '../i18n'
import {localeStore} from '../stores/localeStore'
import {getPerformanceSnippet} from './snippets'

const INITIAL_COUNT = 500

function genItems(start: number, count: number): {id: number; text: string; done: boolean}[] {
  return Array.from({length: count}, (_, i) => ({
    id: start + i,
    text: `Item ${start + i}`,
    done: false,
  }))
}

export function Performance() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale
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
    'cursor-pointer rounded border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

  const demo = (
    <section
      className="rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('performance.demoTitle')}</h3>
      <p className="mb-2 tabular-nums text-xs text-slate-500 dark:text-slate-400">
        {t('performance.totalItems').replace('{n}', String(snap.items.length))}
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => addMany(100)} className={btn}>
          {t('performance.add100')}
        </button>
        <button type="button" onClick={() => removeFirst(100)} disabled={snap.items.length === 0} className={btn}>
          {t('performance.remove100')}
        </button>
        <button type="button" onClick={() => toggleAll(!allDone)} disabled={snap.items.length === 0} className={btn}>
          {allDone ? t('performance.deselectAll') : t('performance.selectAll')}
        </button>
      </div>
      <div
        className="max-h-80 overflow-auto rounded border border-blue-200/60 bg-blue-50/80 dark:border-blue-800/50 dark:bg-blue-950/50"
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
              aria-label={t('performance.itemDone').replace('{id}', String(item.id))}
              className="rounded border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400"
            />
            <span className="w-12 shrink-0 tabular-nums text-xs text-slate-500 dark:text-slate-400">{item.id}</span>
            <span className="min-w-0 truncate text-sm text-slate-900 dark:text-slate-100">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">{t('performance.title')}</h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('performance.intro')}
      </p>

      <CodeBlock
        code={getPerformanceSnippet(locale)}
        title={t('performance.codeTitle')}
        titlePrefix={t('performance.codeTitlePrefix')}
        titleSteps={t('performance.codeTitleSteps')}
        titleSuffix={t('performance.codeTitleSuffix')}
      />
    </PageWithDemo>
  )
}
