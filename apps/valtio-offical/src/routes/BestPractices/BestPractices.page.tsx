import {createStore, type EmpStore, useStore} from '@empjs/valtio'
import {Link} from 'wouter'
import {CodeBlock} from 'src/components/CodeBlock'
import {PageWithDemo} from 'src/components/PageWithDemo'
import {useT} from 'src/i18n'
import {localeStore} from 'src/stores/localeStore'
import {getBestPracticesSnippet} from './snippets'

// ----- Call flow demo: one global store, read snap / write store -----
const callFlowStore = createStore({count: 0, name: ''})

// ----- Local Store (component isolation) demo: each instance has its own useStore -----
function LocalStoreInstance({initialLabel}: {initialLabel: string}) {
  const [snap, store] = useStore({count: 0, label: initialLabel})
  return (
    <div className="rounded border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
      <h4 className="mb-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
        {snap.label} (useStore)
      </h4>
      <p className="mb-2 text-sm">
        count: <strong>{snap.count}</strong> · label: <strong>{snap.label}</strong>
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.set('count', snap.count + 1)} className={btnClass}>
          set count+1
        </button>
        <button
          type="button"
          onClick={() => store.update({label: `${snap.label}-${Date.now().toString().slice(-4)}`})}
          className={btnClass}
        >
          update label
        </button>
        <button
          type="button"
          onClick={() => store.reset({count: 0, label: initialLabel})}
          className="cursor-pointer rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          reset
        </button>
      </div>
    </div>
  )
}

// ----- Component communication demo: type from typeof initialState，改形状只改一处；Store 类型建议导出 -----
const parentInitialState = {count: 100, msg: 'Parent Init'}
type DemoState = typeof parentInitialState
export type DemoStore = EmpStore<DemoState>

function ChildViewer({store}: {store: DemoStore}) {
  const snap = store.useSnapshot()
  return (
    <div className="rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
      <h4 className="mb-2 text-xs font-bold uppercase text-blue-500">Child (Viewer)</h4>
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

function ChildController({store}: {store: DemoStore}) {
  return (
    <div className="rounded border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-900/20">
      <h4 className="mb-2 text-xs font-bold uppercase text-orange-500">Child (Controller)</h4>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => store.count++}
          className="cursor-pointer rounded border border-transparent bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          count++
        </button>
        <button
          type="button"
          onClick={() => store.set('msg', `Hello ${Date.now().toString().slice(-4)}`)}
          className="cursor-pointer rounded border border-transparent bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Set Msg
        </button>
        <button
          type="button"
          onClick={() => store.reset({count: 0, msg: 'Reset'})}
          className="cursor-pointer rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

const sectionClass =
  'scroll-mt-24 rounded border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50'
const sectionNumClass =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
const btnClass =
  'cursor-pointer rounded border border-transparent bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'

export function BestPracticesPage() {
  const t = useT()
  const localeSnap = localeStore.useSnapshot()
  const [snap, store] = useStore<DemoState>(parentInitialState)
  const callSnap = callFlowStore.useSnapshot()

  const demo = (
    <section className="space-y-6" aria-live="polite">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('common.demoResult')}</h3>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {t('bestPractices.callFlowDemoTitle')}
        </h4>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          Count: <strong>{callSnap.count}</strong> · Name: <strong>{callSnap.name}</strong> (read from snap)
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => callFlowStore.set('count', callSnap.count + 1)} className={btnClass}>
            set count+1
          </button>
          <button
            type="button"
            onClick={() => callFlowStore.update({name: `n${Date.now().toString().slice(-4)}`})}
            className={btnClass}
          >
            update name
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {t('bestPractices.localStoreDemoTitle')}
        </h4>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {t('bestPractices.enhancedStoreMethods')}: useSnapshot() · set(key, value) · update(partial) ·
          reset(initialState)
        </p>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <LocalStoreInstance initialLabel={t('common.instanceA')} />
          <LocalStoreInstance initialLabel={t('common.instanceB')} />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{t('bestPractices.localStoreDemoNote')}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {t('bestPractices.compCommDemoTitle')}
        </h4>
        <div className="mb-3 text-sm text-slate-500 dark:text-slate-400">Parent (useStore)</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChildViewer store={store} />
          <ChildController store={store} />
        </div>
        <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-400 dark:border-slate-700/50">
          Parent State: {JSON.stringify(snap)}
        </div>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {t('bestPractices.title')}
      </h1>
      <p className="mb-2 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('bestPractices.intro')}
      </p>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/manual" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          {t('bestPractices.seeManual')}
        </Link>
      </p>

      <div className="space-y-6">
        {([1, 2, 3, 4, 5, 6, 7] as const).map(n => (
          <section key={n} id={`s${n}`} className={sectionClass}>
            <h2 className="mb-2 flex items-center gap-2 font-mono text-base font-semibold text-slate-800 dark:text-slate-200">
              <span className={sectionNumClass}>{n}</span>
              {t(`bestPractices.s${n}Title`)}
            </h2>
            <p className="mb-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t(`bestPractices.s${n}Desc`)}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        <CodeBlock
          code={getBestPracticesSnippet(localeSnap.locale, 'callFlowAndUsage')}
          title={t('bestPractices.codeTitle1')}
          language="typescript"
          fontSize="0.75rem"
        />
        <CodeBlock
          code={getBestPracticesSnippet(localeSnap.locale, 'commonPitfalls')}
          title={t('bestPractices.codeTitle2')}
          language="typescript"
          fontSize="0.75rem"
        />
      </div>
    </PageWithDemo>
  )
}
