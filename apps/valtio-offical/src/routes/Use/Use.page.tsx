import {CodeBlock} from 'src/components/CodeBlock'
import {PageWithDemo} from 'src/components/PageWithDemo'
import {useT} from 'src/i18n'
import {
  AsyncDemoBlock as GlobalAsyncBlock,
  GlobalCounterBlock,
  DerivedDemoBlock as GlobalDerivedBlock,
  HistoryDemoBlock as GlobalHistoryBlock,
} from 'src/routes/Use/components/DemoBlocks'
import {
  AsyncDemoBlock as LocalAsyncBlock,
  LocalCounterBlock,
  DerivedDemoBlock as LocalDerivedBlock,
  HistoryDemoBlock as LocalHistoryBlock,
} from 'src/routes/Use/components/LocalDemoBlocks'
import {getUseSnippet} from 'src/routes/Use/snippets'
import {localeStore} from 'src/stores/localeStore'

export function UsePage() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale
  const demo = (
    <section
      className="space-y-6 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      {/* 1. Basic State */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('createStore.s1Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {t('createStore.s1Desc')} (Global A/B sync, Local C isolated)
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="min-w-[140px] flex-1">
            <GlobalCounterBlock label={`${t('common.instanceA')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <GlobalCounterBlock label={`${t('common.instanceB')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <LocalCounterBlock label="Local Instance" />
          </div>
        </div>
      </div>

      {/* 2. History */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('createStore.s2Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('createStore.s2Desc')}</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="min-w-[140px] flex-1">
            <GlobalHistoryBlock label={`${t('common.instanceA')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <GlobalHistoryBlock label={`${t('common.instanceB')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <LocalHistoryBlock label="Local Instance" />
          </div>
        </div>
      </div>

      {/* 3. Derived */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('createStore.s3Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('createStore.s3Desc')}</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="min-w-[140px] flex-1">
            <GlobalDerivedBlock label={`${t('common.instanceA')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <GlobalDerivedBlock label={`${t('common.instanceB')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <LocalDerivedBlock label="Local Instance" />
          </div>
        </div>
      </div>

      {/* 4. Async */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('createStore.s4Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('createStore.s4Desc')}</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="min-w-[140px] flex-1">
            <GlobalAsyncBlock label={`${t('common.instanceA')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <GlobalAsyncBlock label={`${t('common.instanceB')} (Global)`} />
          </div>
          <div className="min-w-[140px] flex-1">
            <LocalAsyncBlock label="Local Instance" />
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {t('createStore.title')}
      </h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('createStore.intro')}
      </p>

      <CodeBlock
        code={getUseSnippet(locale)}
        title={t('createStore.codeTitle')}
        titlePrefix={t('createStore.codeTitlePrefix')}
        titleSteps={t('createStore.codeTitleSteps')}
        titleSuffix={t('createStore.codeTitleSuffix')}
        fontSize="0.75rem"
      />
    </PageWithDemo>
  )
}
