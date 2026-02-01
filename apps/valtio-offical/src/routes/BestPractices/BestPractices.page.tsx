import {type EnhancedStore, useStore} from '@empjs/valtio'
import {useT} from 'src/i18n'
import {CodeBlock} from '../../components/CodeBlock'
import {localeStore} from '../../stores/localeStore'
import {getBestPracticesSnippet} from './snippets'

// Define State Type
type DemoState = {
  count: number
  msg: string
}

// Child Component
function ChildViewer({store}: {store: EnhancedStore<DemoState>}) {
  const snap = store.useSnapshot()
  return (
    <div className="rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
      <h4 className="mb-2 text-xs font-bold uppercase text-blue-500">Child Component (Viewer)</h4>
      <div className="text-sm">
        <p>
          Count: <strong>{snap.count}</strong>
        </p>
        <p>
          Msg: <strong>{snap.msg}</strong>
        </p>
      </div>
    </div>
  )
}

function ChildController({store}: {store: EnhancedStore<DemoState>}) {
  return (
    <div className="rounded border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-900/20">
      <h4 className="mb-2 text-xs font-bold uppercase text-orange-500">Child Component (Controller)</h4>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => store.count++}
          className="cursor-pointer rounded border border-transparent bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          count++
        </button>
        <button
          onClick={() => store.set('msg', `Hello ${Date.now().toString().slice(-4)}`)}
          className="cursor-pointer rounded border border-transparent bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Set Random Msg
        </button>
        <button
          onClick={() => store.reset({count: 0, msg: 'Reset'})}
          className="cursor-pointer rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export function BestPracticesPage() {
  const t = useT()
  const localeSnap = localeStore.useSnapshot()

  // Parent creates local store
  const [snap, store] = useStore<DemoState>({
    count: 100,
    msg: 'Parent Init',
  })

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {t('bestPractices.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">{t('bestPractices.intro')}</p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Left: Explanation (7 sections by usage weight) */}
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                1
              </span>
              {t('bestPractices.readWriteTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.readWriteDesc')}</p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                2
              </span>
              {t('bestPractices.typeTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.typeDesc')}</p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                3
              </span>
              {t('bestPractices.chooseTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.chooseDesc')}</p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                4
              </span>
              {t('bestPractices.regularTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.regularDesc')}</p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                5
              </span>
              {t('bestPractices.globalTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.globalDesc')}</p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                6
              </span>
              {t('bestPractices.compTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.compDesc')}</p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                7
              </span>
              {t('bestPractices.pitfallsTitle')}
            </h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">{t('bestPractices.pitfallsDesc')}</p>
          </section>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{t('common.demoResult')}</h3>

            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">Parent Component (Provider)</div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Pass store to children */}
              <ChildViewer store={store} />
              <ChildController store={store} />
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-700/50">
              Parent State: {JSON.stringify(snap)}
            </div>
          </div>
        </div>

        {/* Right: Code */}
        <div className="min-w-0">
          <CodeBlock
            code={getBestPracticesSnippet(localeSnap.locale)}
            title={t('bestPractices.codeTitle')}
            language="typescript"
            fontSize="0.75rem"
          />
        </div>
      </div>
    </article>
  )
}
