import {createMap, createSet, createStore, useStore} from '@empjs/valtio'
import {useMemo} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'
import {useT} from '../i18n'
import {localeStore} from '../stores/localeStore'
import {getCollectionsSnippet} from './snippets'

// 全局集合 store：供「跨组件共享」示例使用
const collectionsStore = createStore(
  {
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
    tagSet: createSet<string>(['x']),
  },
  {name: 'CollectionsStore'},
)

const btn =
  'cursor-pointer rounded border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900'

const cardInner = 'rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

/** 全局 store 引用：读 collectionsStore.useSnapshot()，写 collectionsStore.map / collectionsStore.tagSet */
function GlobalCollectionsBlock({label}: {label: string}) {
  const snap = collectionsStore.useSnapshot()
  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])
  const mapSize = snap.map.size
  const setSize = snap.tagSet.size

  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-1 text-slate-900 dark:text-slate-100">
        Map ({mapSize}): {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}
      </p>
      <p className="mb-2 text-slate-900 dark:text-slate-100">
        Set ({setSize}): {setValues.join(', ') || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => collectionsStore.map.set('c', (snap.map.get('c') ?? 0) + 1)}
          className={btn}
        >
          map.set('c', n+1)
        </button>
        <button type="button" onClick={() => collectionsStore.tagSet.add('y')} className={btn}>
          tagSet.add('y')
        </button>
        <button
          type="button"
          onClick={() => (snap.map.has('a') ? collectionsStore.map.delete('a') : null)}
          className={btn}
        >
          map.delete('a')
        </button>
        <button type="button" onClick={() => collectionsStore.tagSet.delete('x')} className={btn}>
          tagSet.delete('x')
        </button>
      </div>
    </div>
  )
}

/** 局部 useStore：每个实例独立 map/set */
function LocalCollectionsBlock({label}: {label: string}) {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
    tagSet: createSet<string>(['x']),
  }))
  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])
  const mapSize = snap.map.size
  const setSize = snap.tagSet.size

  return (
    <div className={cardInner}>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mb-1 text-slate-900 dark:text-slate-100">
        Map ({mapSize}): {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}
      </p>
      <p className="mb-2 text-slate-900 dark:text-slate-100">
        Set ({setSize}): {setValues.join(', ') || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.map.set('c', (snap.map.get('c') ?? 0) + 1)} className={btn}>
          map.set('c', n+1)
        </button>
        <button type="button" onClick={() => store.tagSet.add('y')} className={btn}>
          tagSet.add('y')
        </button>
        <button type="button" onClick={() => (snap.map.has('a') ? store.map.delete('a') : null)} className={btn}>
          map.delete('a')
        </button>
        <button type="button" onClick={() => store.tagSet.clear()} className={btn}>
          tagSet.clear()
        </button>
      </div>
    </div>
  )
}

export function Collections() {
  const t = useT()
  const locale = localeStore.useSnapshot().locale
  const demo = (
    <section
      className="space-y-6 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('collections.s1Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('collections.s1Desc')}</p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <GlobalCollectionsBlock label={t('common.instanceA')} />
          </div>
          <div className="min-w-0 flex-1">
            <GlobalCollectionsBlock label={t('common.instanceB')} />
          </div>
          <div className="min-w-0 flex-1">
            <GlobalCollectionsBlock label={t('common.instanceC')} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('collections.s2Title')}</h3>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('collections.s2Desc')}</p>
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <LocalCollectionsBlock label={t('common.instanceA')} />
          </div>
          <div className="min-w-0 flex-1">
            <LocalCollectionsBlock label={t('common.instanceB')} />
          </div>
          <div className="min-w-0 flex-1">
            <LocalCollectionsBlock label={t('common.instanceC')} />
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">{t('collections.title')}</h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {t('collections.intro')}
      </p>

      <CodeBlock
        code={getCollectionsSnippet(locale)}
        title={t('collections.codeTitle')}
        titlePrefix={t('collections.codeTitlePrefix')}
        titleSteps={t('collections.codeTitleSteps')}
        titleSuffix={t('collections.codeTitleSuffix')}
      />
    </PageWithDemo>
  )
}
