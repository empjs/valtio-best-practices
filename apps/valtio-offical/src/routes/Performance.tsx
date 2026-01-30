import {useStore} from '@empjs/valtio'
import {useMemo} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

// ---------------------------------------------------------------------------
// 1. 长列表 + batch 批量操作
// ---------------------------------------------------------------------------
const codeLongList = `import { useStore } from '@empjs/valtio'

type Item = { id: number; text: string; done: boolean }

const [snap, store] = useStore(() => ({
  items: [] as Item[],
}))

// 批量添加：用 batch 合并多次写，只触发一次订阅通知
function addMany(n: number) {
  store.batch((s) => {
    const start = s.items.length
    for (let i = 0; i < n; i++) {
      s.items.push({ id: start + i, text: \`Item \${start + i}\`, done: false })
    }
  })
}

// 批量删除：batch 内 splice
function removeFirst(n: number) {
  store.batch((s) => {
    s.items.splice(0, n)
  })
}

// 全选/取消：batch 内遍历更新
function toggleAll(done: boolean) {
  store.batch((s) => {
    s.items.forEach((item) => { item.done = done })
  })
}
`

// ---------------------------------------------------------------------------
// 2. 长列表渲染：content-visibility 与虚拟列表
// ---------------------------------------------------------------------------
const codeRender = `// 长列表（>50 条）建议：
// 1. 用 batch 做批量增删改，减少中间渲染
// 2. 列表容器固定高度 + overflow-auto，避免整页撑开
// 3. 每行加 content-visibility: auto（或使用 virtua 等虚拟列表）

function List() {
  const snap = store.useSnapshot()
  return (
    <div className="max-h-96 overflow-auto">
      {snap.items.map((item) => (
        <div
          key={item.id}
          className="border-b border-slate-200 px-2 py-1 flex items-center gap-2"
          style={{ contentVisibility: 'auto' }}
        >
          <input type="checkbox" checked={item.done} onChange={...} />
          <span className="tabular-nums text-slate-700">{item.id}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}
`

const INITIAL_COUNT = 500

function genItems(start: number, count: number): { id: number; text: string; done: boolean }[] {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    text: `Item ${start + i}`,
    done: false,
  }))
}

export function Performance() {
  const [snap, store] = useStore(() => ({
    items: genItems(0, INITIAL_COUNT),
  }))

  const addMany = (n: number) => {
    store.batch(s => {
      const start = s.items.length
      for (let i = 0; i < n; i++) {
        s.items.push({ id: start + i, text: `Item ${start + i}`, done: false })
      }
    })
  }

  const removeFirst = (n: number) => {
    store.batch(s => {
      s.items.splice(0, n)
    })
  }

  const toggleAll = (done: boolean) => {
    store.batch(s => {
      s.items.forEach(item => { item.done = done })
    })
  }

  const toggleOne = (id: number) => {
    const item = store.items.find(i => i.id === id)
    if (item) item.done = !item.done
  }

  const allDone = snap.items.length > 0 && snap.items.every(item => item.done)

  const btn =
    'cursor-pointer rounded border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-violet-50 hover:border-violet-400 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900'

  const demo = (
    <section
      className="rounded-xl border border-violet-200/50 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果：长列表</h3>
      <p className="mb-2 tabular-nums text-xs text-slate-500 dark:text-slate-400">
        共 {snap.items.length} 条，用 batch 批量增删、content-visibility 优化渲染。
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => addMany(100)} className={btn}>
          添加 100 条
        </button>
        <button type="button" onClick={() => removeFirst(100)} disabled={snap.items.length === 0} className={btn}>
          删除前 100 条
        </button>
        <button type="button" onClick={() => toggleAll(!allDone)} disabled={snap.items.length === 0} className={btn}>
          {allDone ? '取消全选' : '全选'}
        </button>
      </div>
      <div
        className="max-h-80 overflow-auto rounded border border-violet-200/50 dark:border-slate-600"
        style={{ contain: 'layout style' }}
      >
        {snap.items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-2 border-b border-slate-100 px-2 py-1.5 dark:border-slate-700"
            style={{ contentVisibility: 'auto' }}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleOne(item.id)}
              aria-label={`Item ${item.id} 完成`}
              className="rounded border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400"
            />
            <span className="w-12 shrink-0 tabular-nums text-xs text-slate-500 dark:text-slate-400">{item.id}</span>
            <span className="min-w-0 truncate text-sm text-slate-900 dark:text-slate-100">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-[#4C1D95] dark:text-slate-100">
        performance
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        长列表场景：用 batch 做批量增删改、content-visibility 优化渲染；大量数据可配合虚拟列表（如 virtua）。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        1. 长列表 + batch 批量操作
      </h2>
      <CodeBlock code={codeLongList} title="批量添加 / 删除 / 全选" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        2. 长列表渲染
      </h2>
      <CodeBlock code={codeRender} title="content-visibility 与虚拟列表" />
    </PageWithDemo>
  )
}
