import {useStore} from '@empjs/valtio'
import {useEffect, useState} from 'react'
import {CodeBlock} from 'src/components/CodeBlock'
import {PageWithDemo} from 'src/components/PageWithDemo'
import {useT} from 'src/i18n'
import {localeStore} from 'src/stores/localeStore'
import {OnlyCount, OnlyName} from './components/DemoComponents'
import {getSubscribeSnippet} from './snippets'

export function SubscribePage() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale
  const [snap, store] = useStore(() => ({count: 0, name: 'x'}))
  const [keyLog, setKeyLog] = useState('')
  const [keysLog, setKeysLog] = useState('')
  const renderLabel = t('common.renderCount')

  useEffect(() => {
    const unsub = store.subscribeKey('count', value => {
      setKeyLog(prev => prev + `count=${value}\n`)
    })
    return unsub
  }, [store])

  useEffect(() => {
    const unsub = store.subscribeKeys(['count', 'name'], (key, value) => {
      setKeysLog(prev => prev + `${key}=${value}\n`)
    })
    return unsub
  }, [store])

  const btn =
    'cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

  const demo = (
    <section
      className="rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">{t('common.demoResult')}</h3>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t('subscribe.fineGrained')}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <OnlyCount store={store} renderLabel={renderLabel} />
        <OnlyName store={store} renderLabel={renderLabel} />
      </div>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t('subscribe.keyLog')}</p>
      <pre
        className="mb-3 max-h-20 overflow-auto rounded border border-blue-200/60 bg-blue-50/80 px-2 py-1 text-xs text-slate-600 dark:border-blue-800/40 dark:bg-blue-950/60 dark:text-slate-400"
        aria-live="polite"
      >
        {keyLog || '—'}
      </pre>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t('subscribe.keysLog')}</p>
      <pre
        className="mb-3 max-h-20 overflow-auto rounded border border-blue-200/60 bg-blue-50/80 px-2 py-1 text-xs text-slate-600 dark:border-blue-800/40 dark:bg-blue-950/60 dark:text-slate-400"
        aria-live="polite"
      >
        {keysLog || '—'}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.set('count', snap.count + 1)} className={btn}>
          {t('subscribe.countPlus')}
        </button>
        <button type="button" onClick={() => store.set('name', snap.name === 'x' ? 'y' : 'x')} className={btn}>
          {t('subscribe.nameToggle')}
        </button>
        <button
          type="button"
          onClick={() =>
            store.batch(s => {
              s.count = 0
              s.name = 'reset'
            })
          }
          className={btn}
        >
          {t('subscribe.batchReset')}
        </button>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {t('subscribe.title')}
      </h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('subscribe.intro')}
      </p>

      <CodeBlock
        code={getSubscribeSnippet(locale)}
        title={t('subscribe.codeTitle')}
        titlePrefix={t('subscribe.codeTitlePrefix')}
        titleSteps={t('subscribe.codeTitleSteps')}
        titleSuffix={t('subscribe.codeTitleSuffix')}
      />
    </PageWithDemo>
  )
}
