/**
 * createStore 完整示例：导入 → 定义 → 读/写 → 历史 → 派生 → 异步
 * 调用闭环：创建 store → 组件 useSnapshot 订阅 → 用户操作调用 store.set/update → 触发订阅更新 → UI 重渲染
 */
export const createStoreSnippet = `// ========== 1. 导入 ==========
// 类型由 initialState 推导，无需手写 Snapshot<T>；全局单例，多处组件可 store.useSnapshot() 或 useSnapshot(store) 订阅
import { createStore } from '@empjs/valtio'

// ========== 2. 定义 store（常规）==========
// 通常在模块顶层或单独 stores/*.ts；store 类型为 { count, name } & StoreBaseMethods，useSnapshot 返回只读快照
const store = createStore(
  { count: 0, name: '' },
  { name: 'MyStore', devtools: true }
)

// ========== 3. 调用闭环：在组件中读取（只读 snap）与更新（用 store 方法）==========
// 读：snap 来自 useSnapshot(store)，key 受 keyof T 约束
// 写：store.set('count', value) 或 store.update({ count, name }) → 触发所有订阅该路径的组件重渲染
function Counter() {
  const snap = store.useSnapshot()
  return <span>{snap.count}</span>
}
function Controls() {
  const snap = store.useSnapshot()
  return (
    <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    // 或批量: store.update({ count: snap.count + 1, name: 'x' })
  )
}

// ========== 4. 带历史：options.history ==========
// 返回的 store 有 .value（可写）、.undo()、.redo()；读用 snap.value.count，写用 store.value.count = x
const historyStore = createStore(
  { count: 0 },
  { history: { limit: 50 } }
)
// 组件内：snap.isUndoEnabled / snap.isRedoEnabled 控制撤销/重做按钮禁用

// ========== 5. 带派生：options.derive ==========
// 返回 { base, derived }；写 base.update()，读 base.useSnapshot() / derived.useSnapshot()
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b }) }
)
// 组件内：useSnapshot(base) 读 base，useSnapshot(derived) 读派生；修改 base 后 derived 自动更新

// ========== 6. 异步请求（常规 store + 手动 loading/error）==========
// 请求前 store.update({ loading: true, error: null })；成功/失败后更新 user 与 loading/error
const asyncStore = createStore({
  user: null as User | null,
  loading: false,
  error: null as Error | null,
})
// 也可把异步方法写在 store 内，this 指向 store，调用 store.loadUser() 即可
`
