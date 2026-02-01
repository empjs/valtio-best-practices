import {CodeBlock} from 'src/components/CodeBlock'
import {useT} from 'src/i18n'
import {localeStore} from 'src/stores/localeStore'
import {
  MANUAL_METHOD_IDS,
  getCreateStoreSnippet,
  getManualMethodSnippet,
  getUseStoreSnippet,
  type ManualMethodId,
} from './snippets'

const sectionClass =
  'scroll-mt-24 rounded border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50'

export function ManualPage() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:pt-10 sm:pb-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_12rem] lg:gap-10 lg:items-start">
        <div className="min-w-0">
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            {t('manual.title')}
          </h1>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {t('manual.intro')}
          </p>

          <div className="space-y-6">
            {/* createStore */}
            <section id="createStore" className={sectionClass}>
              <h2 className="mb-2 font-mono text-base font-semibold text-slate-800 dark:text-slate-200">
                {t('manual.createStoreTitle')}
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t('manual.createStoreDesc')}
              </p>
              <CodeBlock
                code={getCreateStoreSnippet(locale)}
                language="typescript"
                fontSize="0.75rem"
              />
            </section>

            {/* useStore + EmpStore 传导 */}
            <section id="useStore" className={sectionClass}>
              <h2 className="mb-2 font-mono text-base font-semibold text-slate-800 dark:text-slate-200">
                {t('manual.useStoreTitle')}
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t('manual.useStoreDesc')}
              </p>
              <CodeBlock
                code={getUseStoreSnippet(locale)}
                language="typescript"
                fontSize="0.75rem"
              />
            </section>

            {/* 17 个方法 */}
            {MANUAL_METHOD_IDS.map(method => (
              <section
                key={method}
                id={method}
                className={sectionClass}
              >
                <h2 className="mb-2 font-mono text-base font-semibold text-slate-800 dark:text-slate-200">
                  {t(`bestPractices.method_${method}Title`)}
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`bestPractices.method_${method}Desc`)}
                </p>
                <CodeBlock
                  code={getManualMethodSnippet(method as ManualMethodId, locale)}
                  language="typescript"
                  fontSize="0.75rem"
                />
              </section>
            ))}
          </div>
        </div>

        <aside
          className="sticky top-4 shrink-0 w-full lg:w-48"
          aria-label={t('manual.anchorNav')}
        >
          <nav className="rounded border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('manual.anchorNav')}
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="#createStore"
                  className="block truncate rounded px-2 py-1 font-mono text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  createStore
                </a>
              </li>
              <li>
                <a
                  href="#useStore"
                  className="block truncate rounded px-2 py-1 font-mono text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  useStore
                </a>
              </li>
              {MANUAL_METHOD_IDS.map(method => (
                <li key={method}>
                  <a
                    href={`#${method}`}
                    className="block truncate rounded px-2 py-1 font-mono text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {method}()
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </main>
  )
}
