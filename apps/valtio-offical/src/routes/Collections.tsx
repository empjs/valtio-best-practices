import {useStore} from '@empjs/valtio'
import {createMap, createSet} from '@empjs/valtio'
import {useMemo} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

const codeImport = `import { createMap, createSet, useStore } from '@empjs/valtio'

// 创建可代理的 Map/Set，在 store 或组件内使用，增删改会触发订阅更新
`

const codeUsage = `// 模块级或 store 内
const map = createMap<string, number>([['a', 1]])
const tagSet = createSet<string>(['x'])

// 在 store 里作为状态一部分（勿用 key 名 "set"，会与 store.set(key, value) 方法冲突）
const [snap, store] = useStore(() => ({
  map: createMap([['a', 1]]),
  tagSet: createSet(['x']),
}))

// 读: snap.map.get('a'), snap.tagSet.has('x')
// 写: store.map.set('b', 2), store.tagSet.add('y') — 会触发 UI 更新
`

export function Collections() {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([['a', 1], ['b', 2]]),
    tagSet: createSet<string>(['x']),
  }))

  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])

  const btn =
    'cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900'

  const demo = (
    <section
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>
      <p className="mb-1 text-slate-900 dark:text-slate-100">Map: {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ')}</p>
      <p className="mb-2 text-slate-900 dark:text-slate-100">Set: {setValues.join(', ')}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => store.map.set('c', (snap.map.get('c') ?? 0) + 1)} className={btn}>
          map.set('c', n+1)
        </button>
        <button type="button" onClick={() => store.tagSet.add('y')} className={btn}>
          tagSet.add('y')
        </button>
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-[#4C1D95] dark:text-slate-100">
        collections
      </h1>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        createMap / createSet：可代理的 Map/Set，在 store 或组件内使用，增删改会触发订阅更新。
      </p>

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">
        如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入" />

      <h2 className="mb-2 mt-8 text-xl font-medium text-slate-800 dark:text-slate-200">
        用法示例
      </h2>
      <CodeBlock code={codeUsage} title="createMap / createSet" />
    </PageWithDemo>
  )
}
