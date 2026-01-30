import {useStore} from '@empjs/valtio'
import {useEffect, useRef, useState} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'
import {subscribeSnippet} from './snippets'

const cardChip =
  'rounded border border-gray-200 bg-white px-2 py-1 shadow-sm dark:border-slate-600 dark:bg-slate-700/50'

/** 仅用于 OnlyCount/OnlyName 的 store 类型：含 useSnapshot 且快照为 { count, name } */
interface StoreWithCountName {
  useSnapshot(): { count: number; name: string }
}

/** 只读 count，用于演示细粒度：改 name 时此组件不重渲染 */
function OnlyCount({store}: {store: StoreWithCountName}) {
  const snap = store.useSnapshot()
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div className={cardChip}>
      <span className="tabular-nums text-slate-900 dark:text-slate-100">count: {snap.count}</span>
      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">渲染 #{renderCount.current}</span>
    </div>
  )
}

/** 只读 name，用于演示细粒度：改 count 时此组件不重渲染 */
function OnlyName({store}: {store: StoreWithCountName}) {
  const snap = store.useSnapshot()
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div className={cardChip}>
      <span className="text-slate-900 dark:text-slate-100">name: {snap.name}</span>
      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">渲染 #{renderCount.current}</span>
    </div>
  )
}

export function Subscribe() {
  const [snap, store] = useStore(() => ({count: 0, name: 'x'}))
  const [keyLog, setKeyLog] = useState('')
  const [keysLog, setKeysLog] = useState('')

  useEffect(() => {
    const unsub = store.subscribeKey('count', value => {
      setKeyLog(prev => prev + `count=${value}\n`)
    })
    return unsub
  }, [store])

  useEffect(() => {
    const unsub = store.subscribeKeys(['count', 'name'], (key, value) => {
      setKeysLog(prev => prev + `${key}=${value}\n`)
    })
    return unsub
  }, [store])

  const btn =
    'cursor-pointer rounded border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 transition-colors duration-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900'

  const demo = (
    <section
      className="rounded-xl border border-gray-200 bg-white/95 p-4 shadow-md dark:border-slate-600 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        细粒度订阅（只读 count / name，看渲染次数）
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        <OnlyCount store={store} />
        <OnlyName store={store} />
      </div>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        subscribeKey(&apos;count&apos;) 日志
      </p>
      <pre
        className="mb-3 max-h-20 overflow-auto rounded border border-blue-200/60 bg-blue-50/80 px-2 py-1 text-xs text-slate-600 dark:border-blue-800/40 dark:bg-blue-950/60 dark:text-slate-400"
        aria-live="polite"
      >
        {keyLog || '—'}
      </pre>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        subscribeKeys([&apos;count&apos;, &apos;name&apos;]) 日志
      </p>
      <pre
        className="mb-3 max-h-20 overflow-auto rounded border border-blue-200/60 bg-blue-50/80 px-2 py-1 text-xs text-slate-600 dark:border-blue-800/40 dark:bg-blue-950/60 dark:text-slate-400"
        aria-live="polite"
      >
        {keysLog || '—'}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.set('count', snap.count + 1)} className={btn}>
          count+1
        </button>
        <button type="button" onClick={() => store.set('name', snap.name === 'x' ? 'y' : 'x')} className={btn}>
          name 切换
        </button>
        <button
          type="button"
          onClick={() =>
            store.batch(s => {
              s.count = 0
              s.name = 'reset'
            })
          }
          className={btn}
        >
          batch reset
        </button>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">subscribe</h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        subscribeKey / subscribeKeys、batch、以及 useSnapshot 的细粒度订阅（只读用到的字段）。
      </p>

      <CodeBlock code={subscribeSnippet} title="完整示例（导入 → subscribeKey/Keys → batch → 细粒度订阅 → 何时用，含调用闭环与中文提示）" />
    </PageWithDemo>
  )
}
