/**
 * useStore 完整示例：组件内局部 store，每实例一份；支持常规 / 历史 / 派生 / 异步
 * 调用闭环：useStore(initialState) → 得到 [snap, store] → 读 snap、写 store → 仅当前组件树订阅，不影响其他实例
 */
export const useStoreSnippet = `// ========== 1. 导入 ==========
// 每个组件实例拥有独立 store，[snap, store] 类型由 initialState 推导
import { useStore } from '@empjs/valtio'

// ========== 2. 常规用法与调用闭环 ==========
// 惰性初始化也可: useStore(() => ({ count: 0 }))
// 闭环：挂载时创建 store → 读 snap.count 渲染 → 用户点击 → store.set('count', n+1) → 触发本实例订阅 → 重渲染
function LocalCounter() {
  const [snap, store] = useStore({ count: 0 })
  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
// 两个 <LocalCounter /> 各自维护自己的 count，互不影响

// ========== 3. 何时用 createStore vs useStore ==========
// 单例、跨组件共享 → createStore
// 组件内独立状态、每实例一份（表单、编辑器、画板）→ useStore

// ========== 4. 带历史：useStore(initialState, { history: { limit } }) ==========
const [snap, store] = useStore(() => ({ count: 0 }), { history: { limit: 50 } })
// 读: snap.value.count  写: store.value.count = x  撤销/重做: store.undo() / store.redo()

// ========== 5. 带派生：useStore(initialState, { derive }) ==========
const [baseSnap, baseStore, derivedSnap] = useStore(
  () => ({ a: 1, b: 2 }),
  { derive: (get, base) => ({ sum: get(base).a + get(base).b }) }
)
// 读 base: baseSnap.a；读派生: derivedSnap.sum  写: baseStore.update({ a: 2 })

// ========== 6. 异步请求：常规 useStore + 手动 loading/error ==========
// 方式一：手动 store.update。请求前 store.update({ loading: true, error: null })；成功 store.update({ user, loading: false })；失败 store.update({ error, loading: false })
// 方式二：把异步方法写在 store 内，this 指向 store，组件内直接调用 store.loadUser()
function UserPanel() {
  const [snap, store] = useStore(() => ({
    user: null as { name: string } | null,
    loading: false,
    error: null as Error | null,
    loadUser() {
      this.loading = true
      this.error = null
      fetch('/api/user')
        .then(res => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
        .then(user => { this.user = user; this.loading = false })
        .catch(e => { this.error = e instanceof Error ? e : new Error('Unknown'); this.loading = false })
    },
  }))
  if (snap.loading) return <p>Loading…</p>
  if (snap.error) return <p role="alert">Error: {snap.error.message}</p>
  return (
    <div>
      {snap.user ? <p>user: {snap.user.name}</p> : <p>未加载</p>}
      <button onClick={() => store.loadUser()} disabled={snap.loading}>
        {snap.user ? '重新加载' : '加载用户'}
      </button>
    </div>
  )
}
// 闭环：点击按钮 → store.loadUser() → this.loading = true → UI 显示 Loading → 请求完成 → this.user / this.error、this.loading = false → UI 重渲染
`
