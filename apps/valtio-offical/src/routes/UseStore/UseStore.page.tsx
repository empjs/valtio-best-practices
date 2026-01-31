import {CodeBlock} from 'src/components/CodeBlock'
import {PageWithDemo} from 'src/components/PageWithDemo'
import {useT} from 'src/i18n'
import {localeStore} from 'src/stores/localeStore'
import {AsyncDemoBlock, DerivedDemoBlock, HistoryDemoBlock, LocalCounterBlock} from './components/DemoBlocks'
import {getUseStoreSnippet} from './snippets'

export function UseStorePage() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale
  const demo = (
    <section
      className="space-y-6 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('useStore.s1Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('useStore.s1Desc')}</p>
        <div className="flex gap-3">
          <div className="min-w-0 w-1/3">
            <LocalCounterBlock label={t('common.instanceA')} />
          </div>
          <div className="min-w-0 w-1/3">
            <LocalCounterBlock label={t('common.instanceB')} />
          </div>
          <div className="min-w-0 w-1/3">
            <LocalCounterBlock label={t('common.instanceC')} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('useStore.s2Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('useStore.s2Desc')}</p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <HistoryDemoBlock label={t('common.instanceA')} />
          </div>
          <div className="min-w-0 flex-1">
            <HistoryDemoBlock label={t('common.instanceB')} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('useStore.s3Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('useStore.s3Desc')}</p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <DerivedDemoBlock label={t('common.instanceA')} />
          </div>
          <div className="min-w-0 flex-1">
            <DerivedDemoBlock label={t('common.instanceB')} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('useStore.s4Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('useStore.s4Desc')}</p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <AsyncDemoBlock label={t('common.instanceA')} />
          </div>
          <div className="min-w-0 flex-1">
            <AsyncDemoBlock label={t('common.instanceB')} />
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {t('useStore.title')}
      </h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('useStore.intro')}
      </p>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{t('useStore.signature')}</p>

      <CodeBlock
        code={getUseStoreSnippet(locale)}
        title={t('useStore.codeTitle')}
        titlePrefix={t('useStore.codeTitlePrefix')}
        titleSteps={t('useStore.codeTitleSteps')}
        titleSuffix={t('useStore.codeTitleSuffix')}
      />
    </PageWithDemo>
  )
}
