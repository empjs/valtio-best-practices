import {CodeBlock} from 'src/components/CodeBlock'
import {PageWithDemo} from 'src/components/PageWithDemo'
import {useT} from 'src/i18n'
import {localeStore} from 'src/stores/localeStore'
import {DerivedDemo} from './components/DerivedDemo'
import {FineGrainedDemo} from './components/FineGrainedDemo'
import {LongListDemo} from './components/LongListDemo'
import {TransientDemo} from './components/TransientDemo'
import {
  performanceSnippet,
  performanceSnippet2,
  performanceSnippet2En,
  performanceSnippet3,
  performanceSnippet3En,
  performanceSnippet4,
  performanceSnippet4En,
  performanceSnippetEn,
} from './snippets'

export function PerformancePage() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale

  // Logic to show codes based on grid or just show all codes in a list?
  // The user asked for "4 demo scenarios arranged in a grid"
  // Usually PageWithDemo puts demo on right.
  // Let's make the "demo" part be the 2x2 grid.

  const demoGrid = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-[600px] w-full">
      <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm dark:border-slate-600 dark:bg-slate-800 flex flex-col overflow-hidden">
        <LongListDemo />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm dark:border-slate-600 dark:bg-slate-800 flex flex-col overflow-hidden">
        <FineGrainedDemo />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm dark:border-slate-600 dark:bg-slate-800 flex flex-col overflow-hidden">
        <TransientDemo />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm dark:border-slate-600 dark:bg-slate-800 flex flex-col overflow-hidden">
        <DerivedDemo />
      </div>
    </div>
  )

  const codeContent =
    locale === 'zh'
      ? [performanceSnippet, performanceSnippet2, performanceSnippet3, performanceSnippet4]
      : [performanceSnippetEn, performanceSnippet2En, performanceSnippet3En, performanceSnippet4En]

  return (
    <PageWithDemo demo={demoGrid}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {t('performance.title')}
      </h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('performance.intro')}
      </p>

      <div className="space-y-6">
        <CodeBlock code={codeContent[0]} title={t('performance.s1Title')} fontSize="0.75rem" />
        <CodeBlock code={codeContent[1]} title={t('performance.s2Title')} fontSize="0.75rem" />
        <CodeBlock code={codeContent[2]} title={t('performance.s3Title')} fontSize="0.75rem" />
        <CodeBlock code={codeContent[3]} title={t('performance.s4Title')} fontSize="0.75rem" />
      </div>
    </PageWithDemo>
  )
}
