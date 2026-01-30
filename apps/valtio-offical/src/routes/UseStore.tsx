import {useStore} from '@empjs/valtio'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'
import {useT} from '../i18n'
import {localeStore} from '../stores/localeStore'
import {getUseStoreSnippet} from './snippets'

const btn =
  'cursor-pointer rounded border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

const cardInner = 'rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

/** 每个实例内部 useStore，拥有独立 count，互不影响 */
function LocalCounterBlock({label}: {label: string}) {
  const [snap, store] = useStore({count: 0})
  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</p>
      <button
        type="button"
        onClick={() => store.set('count', snap.count + 1)}
        className="cursor-pointer rounded border border-transparent bg-blue-600 px-2.5 py-1 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900"
      >
        +1
      </button>
    </div>
  )
}

/** 带历史的 useStore demo */
function HistoryDemoBlock({label}: {label?: string}) {
  const t = useT()
  const [snap, store] = useStore(() => ({count: 0}), {history: {limit: 10}})
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.value.count}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => (store.value.count = snap.value.count + 1)} className={btn}>
          +1
        </button>
        <button
          type="button"
          onClick={() => store.undo()}
          disabled={!snap.isUndoEnabled}
          className={btn}
          aria-label={t('common.undo')}
        >
          {t('common.undo')}
        </button>
        <button
          type="button"
          onClick={() => store.redo()}
          disabled={!snap.isRedoEnabled}
          className={btn}
          aria-label={t('common.redo')}
        >
          {t('common.redo')}
        </button>
      </div>
    </div>
  )
}

/** 带派生的 useStore demo */
function DerivedDemoBlock({label}: {label?: string}) {
  const [baseSnap, baseStore, derivedSnap] = useStore(() => ({a: 1, b: 2}), {
    derive: (get, base) => ({sum: get(base).a + get(base).b}),
  })
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-1 tabular-nums text-slate-900 dark:text-slate-100">
        base: a={baseSnap.a}, b={baseSnap.b}
      </p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">derived.sum: {derivedSnap.sum}</p>
      <button type="button" onClick={() => baseStore.update({a: baseSnap.a + 1})} className={btn}>
        a+1
      </button>
    </div>
  )
}

/** 异步请求（局部 store）demo */
function AsyncDemoBlock({label}: {label?: string}) {
  const t = useT()
  const [snap, store] = useStore(() => ({
    user: null as {name: string} | null,
    loading: false,
    error: null as Error | null,
    loadUser() {
      this.loading = true
      this.error = null
      setTimeout(() => {
        this.user = {name: 'Bob'}
        this.loading = false
      }, 500)
    },
  }))

  if (snap.loading)
    return (
      <div className={cardInner}>
        {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
        <p className="text-slate-500">{t('common.loading')}</p>
      </div>
    )
  if (snap.error)
    return (
      <div className={cardInner}>
        {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
        <p className="text-red-600" role="alert">
          Error: {snap.error.message}
        </p>
      </div>
    )
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-2 text-slate-900 dark:text-slate-100">{snap.user ? `user: ${snap.user.name}` : t('common.notLoaded')}</p>
      <button type="button" onClick={() => store.loadUser()} className={btn}>
        {snap.user ? t('common.reload') : t('common.loadUser')}
      </button>
    </div>
  )
}

export function UseStore() {
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
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">{t('useStore.title')}</h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('useStore.intro')}
      </p>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{t('useStore.signature')}</p>

      <CodeBlock code={getUseStoreSnippet(locale)} title={t('useStore.codeTitle')} />
    </PageWithDemo>
  )
}
