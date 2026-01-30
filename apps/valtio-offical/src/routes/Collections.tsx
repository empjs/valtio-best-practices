import {createMap, createSet, useStore} from '@empjs/valtio'
import {useMemo} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'
import {useT} from '../i18n'
import {localeStore} from '../stores/localeStore'
import {getCollectionsSnippet} from './snippets'

export function Collections() {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
    tagSet: createSet<string>(['x']),
  }))

  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])

  const btn =
    'cursor-pointer rounded border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

  const t = useT()
  const locale = localeStore.useSnapshot().locale
  const demo = (
    <section
      className="rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('common.demoResult')}</h3>
      <p className="mb-1 text-slate-900 dark:text-slate-100">
        Map: {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ')}
      </p>
      <p className="mb-2 text-slate-900 dark:text-slate-100">Set: {setValues.join(', ')}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.map.set('c', (snap.map.get('c') ?? 0) + 1)} className={btn}>
          map.set('c', n+1)
        </button>
        <button type="button" onClick={() => store.tagSet.add('y')} className={btn}>
          tagSet.add('y')
        </button>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">{t('collections.title')}</h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('collections.intro')}
      </p>

      <CodeBlock code={getCollectionsSnippet(locale)} title={t('collections.codeTitle')} />
    </PageWithDemo>
  )
}
