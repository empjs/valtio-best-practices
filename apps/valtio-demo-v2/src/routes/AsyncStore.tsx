import {useAsyncStore} from '@empjs/valtio'
import {useEffect} from 'react'
import {CodeBlock} from '../components/CodeBlock'
import {PageWithDemo} from '../components/PageWithDemo'

// ---------------------------------------------------------------------------
// 1. 导入：createAsyncStore（全局） / useAsyncStore（局部）
// ---------------------------------------------------------------------------
const codeImport = `import { createAsyncStore, useAsyncStore } from '@empjs/valtio'

/**
 * 异步 Store 在普通 store 基础上自动维护：
 * - _loading: Record<string, boolean>  每个 async 任务是否在执行中
 * - _error: Record<string, unknown>     每个 async 任务失败时的错误
 *
 * store.async(key, asyncFn) 注册一个异步任务后：
 * - 返回的函数类型与 asyncFn 完全一致（参数、返回值由实参推导）
 * - 调用时自动设置 _loading[key] = true，完成后 false；失败时写入 _error[key]
 */`

// ---------------------------------------------------------------------------
// 2. 定义 Store：全局 createAsyncStore / 局部 useAsyncStore
// ---------------------------------------------------------------------------
const codeDefine = `// ---------- 全局（单例，跨组件共享） ----------
const store = createAsyncStore({
  user: null as User | null,
  list: [] as Item[],
})

// ---------- 局部（组件内，每实例独立） ----------
function MyComponent() {
  const [snap, store] = useAsyncStore(() => ({
    user: null as User | null,
    list: [] as Item[],
  }))
  // snap 类型为 Snapshot<T & AsyncStoreState>，即包含 _loading、_error
  // store 类型为 T & AsyncStoreState & AsyncStore<T>
}`

// ---------------------------------------------------------------------------
// 3. 注册异步任务：store.async(key, asyncFn)
// ---------------------------------------------------------------------------
const codeAsyncMethod = `// key: 字符串，用于 _loading[key]、_error[key]，建议与业务含义一致（如 'fetchUser'）
// asyncFn: 任意 async 函数，其参数和返回值类型会原样成为「返回的调用函数」的类型

const fetchUser = store.async('fetchUser', async (id: string) => {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error(res.statusText)
  const user = await res.json()
  // 在 asyncFn 内直接写 store，会触发 UI 更新
  store.user = user
  return user
})
// fetchUser 类型为 (id: string) => Promise<User>，与 asyncFn 一致

const fetchList = store.async('fetchList', async () => {
  const res = await fetch('/api/list')
  const list = await res.json()
  store.list = list
  return list
})
// 调用后：snap._loading.fetchUser、snap._loading.fetchList 自动存在
// 失败时：snap._error.fetchUser、snap._error.fetchList 为错误对象`

// ---------------------------------------------------------------------------
// 4. 在组件中：读 loading/error、调用异步、渲染 UI
// ---------------------------------------------------------------------------
const codeUsage = `function UserPanel() {
  const [snap, store] = useAsyncStore(() => ({
    user: null as User | null,
  }))

  const loadUser = store.async('fetchUser', async (id: string) => {
    const res = await fetch(\`/api/users/\${id}\`)
    const user = await res.json()
    store.user = user
    return user
  })

  useEffect(() => {
    loadUser('1')
  }, [])

  // 按 key 读 loading / error，用于 UI
  if (snap._loading.fetchUser) return <p aria-live="polite">Loading…</p>
  if (snap._error.fetchUser) return <p role="alert">Error: {(snap._error.fetchUser as Error).message}</p>
  return <div>{snap.user?.name}</div>
}`

// ---------------------------------------------------------------------------
// 5. 类型要点（无需手写，由 initialState 与 asyncFn 推导）
// ---------------------------------------------------------------------------
const codeTypes = `// Snapshot<T & AsyncStoreState> 包含：
// - 你定义的字段：user, list, ...
// - _loading: { fetchUser?: boolean; fetchList?: boolean; ... }
// - _error: { fetchUser?: unknown; fetchList?: unknown; ... }
//
// store.async('fetchUser', async (id: string) => {...})
// 返回 (id: string) => Promise<...>，参数与返回值与 asyncFn 一致。`

export function AsyncStore() {
  const [snap, store] = useAsyncStore(() => ({ value: '' as string }))
  const fetchDemo = store.async('fetchDemo', async () => {
    await new Promise(r => setTimeout(r, 500))
    store.value = 'loaded'
    return store.value
  })

  useEffect(() => {
    fetchDemo()
  }, [])

  const demo = (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">运行效果</h3>
      {snap._loading.fetchDemo && (
        <p className="text-slate-500">Loading…</p>
      )}
      {snap._error.fetchDemo && (
        <p className="text-red-600" role="alert">Error: {(snap._error.fetchDemo as Error).message}</p>
      )}
      {!snap._loading.fetchDemo && !snap._error.fetchDemo && (
        <p className="text-slate-900 dark:text-slate-100">value: {snap.value || '—'}</p>
      )}
      <button
        type="button"
        onClick={() => fetchDemo()}
        disabled={snap._loading.fetchDemo}
        className="mt-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus-visible:ring-offset-slate-900"
      >
        {snap._loading.fetchDemo ? 'Loading…' : '重新请求'}
      </button>
    </section>
  )

  return (
    <PageWithDemo demo={demo}>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        asyncStore
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        异步 store：store.async(key, asyncFn) 自动维护 _loading[key]、_error[key]，返回的调用函数类型与 asyncFn 一致。
      </p>

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        1. 如何导入
      </h2>
      <CodeBlock code={codeImport} title="导入与概念" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        2. 定义 Store（全局 / 局部）
      </h2>
      <CodeBlock code={codeDefine} title="createAsyncStore / useAsyncStore" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        3. 注册异步任务：store.async(key, asyncFn)
      </h2>
      <CodeBlock code={codeAsyncMethod} title="store.async" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        4. 在组件中读 loading/error 并调用
      </h2>
      <CodeBlock code={codeUsage} title="完整用法示例" />

      <h2 className="mb-2 mt-6 text-lg font-medium text-slate-800 dark:text-slate-200">
        5. 类型要点
      </h2>
      <CodeBlock code={codeTypes} title="Snapshot 与返回函数类型" />
    </PageWithDemo>
  )
}
