import {useT} from 'src/i18n'
import {asyncStore, derivedStore, historyStore} from 'src/routes/CreateStore/demos.store'
import {demoStore} from 'src/stores/demoStore'

const btn =
  'cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

const cardInner = 'rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

/** 单个展示块：读同一全局 store，任意一处 +1 会同步到所有实例 */
export function GlobalCounterBlock({label}: {label: string}) {
  const snap = demoStore.useSnapshot()
  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</p>
      <button
        type="button"
        onClick={() => demoStore.set('count', snap.count + 1)}
        className="cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900"
      >
        +1
      </button>
    </div>
  )
}

/** 带历史的 createStore demo：读 snap.value，写 store.value，undo/redo，显示当前记录步数 */
export function HistoryDemoBlock({label}: {label?: string}) {
  const t = useT()
  const snap = historyStore.useSnapshot()
  const steps = snap.history?.nodes?.length ?? 0
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-1 tabular-nums text-slate-900 dark:text-slate-100">count: {snap.value.count}</p>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        {t('common.historySteps')}: {steps}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => (historyStore.value.count = snap.value.count + 1)} className={btn}>
          +1
        </button>
        <button
          type="button"
          onClick={() => historyStore.undo()}
          disabled={!snap.isUndoEnabled}
          className={btn}
          aria-label={t('common.undo')}
        >
          {t('common.undo')}
        </button>
        <button
          type="button"
          onClick={() => historyStore.redo()}
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

/** 带派生的 createStore demo：base + derived（与普通用法一致：store.useSnapshot()） */
export function DerivedDemoBlock({label}: {label?: string}) {
  const baseSnap = derivedStore.base.useSnapshot()
  const derivedSnap = derivedStore.derived.useSnapshot()
  return (
    <div className={cardInner}>
      {label ? <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p> : null}
      <p className="mb-1 tabular-nums text-slate-900 dark:text-slate-100">
        base: a={baseSnap.a}, b={baseSnap.b}
      </p>
      <p className="mb-2 tabular-nums text-slate-900 dark:text-slate-100">derived.sum: {derivedSnap.sum}</p>
      <button type="button" onClick={() => derivedStore.base.update({a: baseSnap.a + 1})} className={btn}>
        a+1
      </button>
    </div>
  )
}

/** 异步请求（全局 store）demo：异步方法在 store 内，推荐 store.useSnapshot() */
export function AsyncDemoBlock({label}: {label?: string}) {
  const t = useT()
  const snap = asyncStore.useSnapshot()

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
      <p className="mb-2 text-slate-900 dark:text-slate-100">
        {snap.user ? `user: ${snap.user.name}` : t('common.notLoaded')}
      </p>
      <button type="button" onClick={() => asyncStore.loadUser()} className={btn}>
        {snap.user ? t('common.reload') : t('common.loadUser')}
      </button>
    </div>
  )
}
