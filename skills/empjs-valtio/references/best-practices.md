# @empjs/valtio 最佳实践

根据 [empjs-valtio Skill](../SKILL.md) 整理。调用闭环（必守）→ 类型与选型 → 常用用法 → 常见错误。每节与 SKILL 对应，含要点与简短示例。

---

## 1. 调用闭环（必守）

对应 SKILL「调用闭环（重要）」。每次写组件都要遵守，否则易出现「订阅不更新」等 bug。

1. **读**：只用 `snap`（来自 `store.useSnapshot()` 或 `useStore` 的 `snap`），不要直接读 `store.xxx` 做渲染，否则不触发订阅。
2. **写**：用 store 方法（`set`、`update`、`store.key = value` 等），写后所有订阅该路径的组件会重渲染。
3. **历史 store**：读用 `snap.value.xxx`，写用 `store.value.xxx = y`；撤销/重做用 `snap.undo()` / `snap.redo()`；当前记录步数可用 `snap.history?.nodes?.length`。

```ts
// 常规：读 snap，写 store
const snap = store.useSnapshot()
return <span>{snap.count}</span>
store.set('count', snap.count + 1)

// 历史：读 snap.value，写 store.value
const snap = store.useSnapshot()
return <span>{snap.value.count}</span>
store.value.count = snap.value.count + 1
snap.undo()
```

---

## 2. 类型定义：使用 EmpStore\<T\>

对应 SKILL「类型与组件通信」之类型。用 `EmpStore<T>` 表示「状态 + 增强方法」，不要手写 `interface MyStore { useSnapshot(): ...; set(): ... }`；`createStore` / `useStore` 返回的 store 即 `EmpStore`。

**不推荐**：手写接口，容易漏掉 `set`、`reset`、`useSnapshot` 等方法。

```ts
// BAD
interface MyStore {
  useSnapshot(): MyState
  // 漏写 set、reset、batch、subscribe...
}
```

**推荐**：用 `EmpStore<T>` 一步到位，包含 `useSnapshot`、`set`、`reset`、`batch`、`subscribe` 等全部增强方法。类型用 `typeof` 从初始对象推导，改形状时只改 `initialState` 一处。建议导出 `export type Store = EmpStore<State>`，子组件或其它模块可直接用 `Store`。

```ts
import { type EmpStore, createStore, useStore } from '@empjs/valtio'

const initialState = { count: 0, name: '' }
type State = typeof initialState
export type Store = EmpStore<State>   // 建议导出，子组件 props 用 Store
```

---

## 3. 选型：createStore vs useStore

对应 SKILL「何时用 createStore vs useStore」。

| 场景 | 使用 |
|------|------|
| 单例、跨组件共享（如主题、用户、全局计数） | `createStore(initialState, options?)` |
| 组件内独立状态、每实例一份（表单、编辑器、画板） | `useStore(initialState, options?)` |

---

## 4. 常规 Store

对应 SKILL「按使用方法速查」之常规 store。读 `useSnapshot()` / `snap`，写 `set` / `update`。

**createStore**：模块级单例，跨组件共享。读用 `store.useSnapshot()`，写用 `store.set` / `store.update`。

**useStore**：组件内每实例独立。返回 `[snap, store]`，读用 `snap`，写用 `store`；`initialState` 可为函数实现惰性初始化。

```ts
const store = createStore({ count: 0, name: '' })
const [snap, store] = useStore({ count: 0 })
// 或惰性初始化
const [snap, store] = useStore(() => ({ count: 0 }))
```

---

## 5. 全局 Store（Global）

对应 SKILL「类型与组件通信」之全局 Store。跨组件共享时用 `createStore`，返回类型即 `EmpStore<T>`（自动推导）。

```ts
const globalStore = createStore({ count: 0, name: 'global' })
// 类型为 EmpStore<{ count: number; name: string }>
```

---

## 6. 组件通信（Parent → Child）

对应 SKILL「类型与组件通信」之父传子。用 `const initialState` + `type State = typeof initialState`，改形状只改一处；建议 `export type Store = EmpStore<State>`，子组件收 `Store`，父组件 `useStore<State>(initialState)`。

**子组件**：props 接收 `Store`（即 `EmpStore<State>`），既能读（`store.useSnapshot()`）也能写（`store.set`、`store.reset`、`store.count++` 等）。

**父组件**：`useStore<State>(initialState)`，类型与初始状态同源。

```ts
const initialState = { count: 10, name: 'parent' }
type State = typeof initialState
export type Store = EmpStore<State>

function ChildComponent({ store }: { store: Store }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={() => store.count++}>+1</button>
      <button onClick={() => store.set('name', 'child')}>Change Name</button>
      <button onClick={() => store.reset({ count: 0, name: 'reset' })}>Reset</button>
    </div>
  )
}

function ParentComponent() {
  const [snap, store] = useStore<State>(initialState)
  return <ChildComponent store={store} />
}
```

要点：读只用 `snap`，写用 store 方法或 `store.key = value`。

---

## 7. 常见错误与注意点

对应 SKILL「常见错误与注意点」。

- **"Please use proxy object"**：传给 `snapshot` / `useSnapshot` / `subscribe` 的必须是 proxy（createStore/useStore 返回的 store 或 base），不要传普通对象。
- **派生函数签名**：`derive: (get, proxy) => derivedObject`，`get(proxy)` 得当前快照，返回纯对象，不要写副作用。
- **集合 key 名**：勿用 key 名 `"set"`，会与 `store.set(key, value)` 方法冲突。

更多用法见 [usage.md](usage.md)，API 见 [api.md](api.md)。
