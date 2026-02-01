# @empjs/valtio 最佳实践示例

与 [references/best-practices.md](../references/best-practices.md) 对应，按权重顺序：调用闭环 → 类型 → 选型 → 常规/全局/父传子 → 注意点。

```tsx
import { type EnhancedStore, createStore, useStore } from '@empjs/valtio'

// 1. 调用闭环：读用 snap，写用 store（勿用 store.xxx 做渲染）
// 2. 类型定义：使用 EnhancedStore<T>
type MyState = { count: number; name: string }
type MyStore = EnhancedStore<MyState>

// 3. 选型：单例/跨组件 → createStore；组件内每实例 → useStore
// 4. 常规 Store：createStore 模块级、useStore 组件内
// 5. 全局 Store
const globalStore = createStore({ count: 0, name: 'global' })

// 6. 组件通信 (Parent -> Child)

// 子组件：接收 EnhancedStore，读用 snap、写用 store
function ChildComponent({ store }: { store: EnhancedStore<MyState> }) {
  const snap = store.useSnapshot() // 读：只用 snap
  return (
    <div>
      <p>Count: {snap.count}</p>
      <p>Name: {snap.name}</p>
      <button onClick={() => store.count++}>+1</button>
      <button onClick={() => store.set('name', 'child')}>Change Name</button>
      <button onClick={() => store.reset({ count: 0, name: 'reset' })}>Reset</button>
    </div>
  )
}

// 父组件：用 useStore 创建 store 并传给子组件
function ParentComponent() {
  const [snap, store] = useStore({ count: 10, name: 'parent' })
  return <ChildComponent store={store} />
}

// 使用全局 store 的组件
function GlobalConsumer() {
  const snap = globalStore.useSnapshot()
  return (
    <div>
      <p>Global count: {snap.count}</p>
      <button onClick={() => globalStore.set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
```

要点回顾：

- **调用闭环**：读只用 `snap`，写用 store 方法或 `store.key = value`；历史 store 读 `snap.value`、写 `store.value.xxx`。
- **类型**：`EnhancedStore<MyState>` 覆盖「状态 + 增强方法」，无需手写接口。
- **选型**：单例/跨组件用 `createStore`，组件内每实例用 `useStore`。
- **全局**：`createStore(initialState)` 得到单例，跨组件共享。
- **父传子**：父组件 `useStore(...)` 得到 `[snap, store]`，把 `store` 传给子组件；子组件用 `store.useSnapshot()` 读、`store.set` / `store.reset` / 直接写 `store.key` 写。
- **常见错误**：勿传普通对象给 `useSnapshot`/`subscribe`（须传 proxy）；集合状态勿用 key 名 `"set"`；派生函数须为纯函数。
