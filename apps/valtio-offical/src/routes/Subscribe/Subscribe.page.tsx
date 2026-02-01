import {useStore} from '@empjs/valtio'
import {CodeBlock} from 'src/components/CodeBlock'
import {PageWithDemo} from 'src/components/PageWithDemo'
import {useT} from 'src/i18n'
import {localeStore} from 'src/stores/localeStore'
import {SubscribeBatchDemo, SubscribeKeyDemo, SubscribeKeysDemo} from './components'
import {OnlyCount, OnlyName} from './components/DemoComponents'
import {getSubscribeSnippet} from './snippets'

const cardClass =
  'rounded-xl border border-gray-200 bg-white/95 p-3 shadow-md dark:border-slate-600 dark:bg-slate-800 min-h-[140px] flex flex-col'
const btn =
  'cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

export function SubscribePage() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale
  const [snap, store] = useStore(() => ({count: 0, name: 'x'}))
  const renderLabel = t('common.renderCount')

  const demo = (
    <section className="space-y-4" aria-live="polite">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('common.demoResult')}</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* 1. 细粒度订阅 */}
        <div className={cardClass}>
          <h4 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {t('subscribe.fineGrained')}
          </h4>
          <div className="mb-2 flex flex-wrap gap-2">
            <OnlyCount store={store} renderLabel={renderLabel} />
            <OnlyName store={store} renderLabel={renderLabel} />
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            <button type="button" onClick={() => store.set('count', snap.count + 1)} className={btn}>
              {t('subscribe.countPlus')}
            </button>
            <button type="button" onClick={() => store.set('name', snap.name === 'x' ? 'y' : 'x')} className={btn}>
              {t('subscribe.nameToggle')}
            </button>
          </div>
        </div>
        {/* 2. subscribeKey */}
        <div className={cardClass}>
          <SubscribeKeyDemo store={store} btn={btn} />
        </div>
        {/* 3. subscribeKeys */}
        <div className={cardClass}>
          <SubscribeKeysDemo store={store} btn={btn} />
        </div>
        {/* 4. batch */}
        <div className={cardClass}>
          <SubscribeBatchDemo store={store} renderLabel={renderLabel} btn={btn} />
        </div>
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
        fontSize="0.75rem"
      />
    </PageWithDemo>
  )
}
