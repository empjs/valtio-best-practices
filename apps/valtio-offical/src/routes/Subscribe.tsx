import {useStore} from '@empjs/valtio'
import {useRef, useEffect, useState} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

// ---------------------------------------------------------------------------
// 1. 导入与概念
// ---------------------------------------------------------------------------
const codeImport = `import { createStore, useStore } from '@empjs/valtio'

// 订阅相关 API：
// - subscribeKey / subscribeKeys：非 React 场景下只监听指定 key
// - batch：多次写合并为一次通知，减少中间渲染
// - useSnapshot：只在实际访问的路径上订阅，只读用到的字段即可细粒度更新
`

// ---------------------------------------------------------------------------
// 2. subscribeKey：单 key 订阅
// ---------------------------------------------------------------------------
const codeSubscribeKey = `const store = createStore({ count: 0, name: '' })

// 只订阅单个 key 变化，回调参数为最新 value
// 返回 Unsubscribe，用于取消订阅（如 useEffect 里 return unsub）
const unsub = store.subscribeKey('count', (value) => {
  console.log('count changed', value)
  // 可用于：持久化到 localStorage、上报、logger 等
})

// 组件卸载时取消
useEffect(() => {
  const unsub = store.subscribeKey('count', (v) => setLog(prev => prev + \`count=\${v}\\n\`))
  return unsub
}, [store])
`

// ---------------------------------------------------------------------------
// 3. subscribeKeys：多 key 订阅
// ---------------------------------------------------------------------------
const codeSubscribeKeys = `// 订阅多个 key，回调 (key, value) 便于区分
const unsub = store.subscribeKeys(['count', 'name'], (key, value) => {
  console.log(key, value)
})

// 同样返回 Unsubscribe，用于 useEffect 清理
useEffect(() => {
  const unsub = store.subscribeKeys(['count', 'name'], (k, v) => {
    setLog(prev => prev + \`\${k}=\${v}\\n\`)
  })
  return unsub
}, [store])
`

// ---------------------------------------------------------------------------
// 4. batch：批量更新
// ---------------------------------------------------------------------------
const codeBatch = `// 多次写放在 batch 内，只触发一次订阅通知，减少中间渲染
store.batch((s) => {
  s.count = 1
  s.name = 'a'
  // 中间不会触发 subscribe / useSnapshot 的组件重渲染
})

// 等价于不用 batch 时连续 set，但会触发多次通知
// store.set('count', 1)
// store.set('name', 'a')
`

// ---------------------------------------------------------------------------
// 5. 细粒度订阅：只读用到的字段
// ---------------------------------------------------------------------------
const codeFineGrained = `// useSnapshot(store) 只在实际「访问」的路径上建立订阅
// 组件只读 snap.count 时，store.name 变化不会导致该组件重渲染

function OnlyCount() {
  const snap = store.useSnapshot()
  return <span>{snap.count}</span>  // 只订阅了 count
}

function OnlyName() {
  const snap = store.useSnapshot()
  return <span>{snap.name}</span>   // 只订阅了 name
}

// 父组件中：改 store.name 时 OnlyCount 不重渲染，改 store.count 时 OnlyName 不重渲染
`

// ---------------------------------------------------------------------------
// 6. 何时用
// ---------------------------------------------------------------------------
const codeWhen = `// subscribeKey / subscribeKeys：非 React 逻辑（持久化、logger、与外部系统同步）
// batch：一次操作要改多个字段时，减少中间渲染
// 细粒度：大 store 时尽量每个组件只读自己需要的字段，无需手写 selector
`

const cardChip =
  'rounded border border-violet-200/50 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-700/50'

/** 只读 count，用于演示细粒度：改 name 时此组件不重渲染 */
function OnlyCount({store}: { store: ReturnType<typeof useStore>[1] }) {
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
function OnlyName({store}: { store: ReturnType<typeof useStore>[1] }) {
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
  const [snap, store] = useStore(() => ({ count: 0, name: 'x' }))
  const [keyLog, setKeyLog] = useState('')
  const [keysLog, setKeysLog] = useState('')

  useEffect(() => {
    const unsub = store.subscribeKey('count', (value) => {
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
    'cursor-pointer rounded border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-violet-50 hover:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900'

  const demo = (
    <section
      className="rounded-xl border border-violet-200/50 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">细粒度订阅（只读 count / name，看渲染次数）</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <OnlyCount store={store} />
        <OnlyName store={store} />
      </div>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">subscribeKey(&apos;count&apos;) 日志</p>
      <pre className="mb-3 max-h-20 overflow-auto rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400" aria-live="polite">
        {keyLog || '—'}
      </pre>

      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">subscribeKeys([&apos;count&apos;, &apos;name&apos;]) 日志</p>
      <pre className="mb-3 max-h-20 overflow-auto rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400" aria-live="polite">
        {keysLog || '—'}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.set('count', snap.count + 1)} className={btn}>
          count+1
        </button>
        <button type="button" onClick={() => store.set('name', snap.name === 'x' ? 'y' : 'x')} className={btn}>
          name 切换
        </button>
        <button type="button" onClick={() => store.batch(s => { s.count = 0; s.name = 'reset' })} className={btn}>
          batch reset
        </button>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-[#4C1D95] dark:text-slate-100">
        subscribe
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        subscribeKey / subscribeKeys、batch、以及 useSnapshot 的细粒度订阅（只读用到的字段）。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        1. 如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入与概念" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        2. subscribeKey：单 key 订阅
      </h2>
      <CodeBlock code={codeSubscribeKey} title="subscribeKey" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        3. subscribeKeys：多 key 订阅
      </h2>
      <CodeBlock code={codeSubscribeKeys} title="subscribeKeys" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        4. batch：批量更新
      </h2>
      <CodeBlock code={codeBatch} title="batch" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        5. 细粒度订阅（只读用到的字段）
      </h2>
      <CodeBlock code={codeFineGrained} title="useSnapshot 按路径订阅" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        6. 何时用
      </h2>
      <CodeBlock code={codeWhen} title="选用场景" />
    </PageWithDemo>
  )
}
