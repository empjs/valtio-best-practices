---
name: empjs-valtio
description: "@empjs/valtio 状态库使用指南。基于 Valtio v2 的增强封装，提供 createStore、useStore、历史回溯、派生状态、持久化、Map/Set 代理等。在以下场景使用本 skill：使用或迁移到 @empjs/valtio、在 React 中实现全局/局部 proxy 状态、需要撤销重做/derive/持久化、编写或审查 valtio 相关代码、排查 \"Please use proxy object\" 或订阅不更新问题。"
---

# @empjs/valtio Skill

基于 **Valtio v2** 的增强状态库，在 `proxy` + `useSnapshot` 之上提供开箱即用的 `createStore` / `useStore`、历史、派生、持久化与 Store 方法封装。

## 何时用 createStore vs useStore

| 场景 | 使用 |
|------|------|
| 单例、跨组件共享（如主题、用户、全局计数） | `createStore(initialState, options?)` |
| 组件内独立状态、每实例一份（表单、编辑器、画板） | `useStore(initialState, options?)` |

## 核心 API 速查

### createStore

```ts
import { createStore } from '@empjs/valtio'

// 常规
const store = createStore({ count: 0, name: '' }, { name?: string, devtools?: boolean })
// 使用：store.useSnapshot()、store.set('count', n)、store.update({ count, name })

// 带历史（撤销/重做）
const store = createStore({ text: '' }, { history: {} })           // 不限制步数
const store = createStore({ text: '' }, { history: { limit: 50 } })  // 最多 50 步
// snap = store.useSnapshot() → { value, history, undo, redo, isUndoEnabled, isRedoEnabled }

// 带派生
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, proxy) => ({ sum: get(proxy).a + get(proxy).b }) }
)
// base.useSnapshot() 原始状态；derived.useSnapshot() → { sum }
```

### useStore

```ts
import { useStore } from '@empjs/valtio'

// 常规：[snap, store]
const [snap, store] = useStore({ count: 0 })
// 或惰性初始化：useStore(() => ({ count: 0 }))

// 带历史
const [snap, store] = useStore(initialState, { history: { limit: 50 } })

// 带派生：[baseSnap, baseStore, derivedSnap]
const [baseSnap, baseStore, derivedSnap] = useStore(
  { a: 1, b: 2 },
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }
)
```

### Store 通用方法（createStore / useStore 返回的 store）

- **读**：`getSnapshot()`、`useSnapshot()`（React 内用）
- **订阅**：`subscribe(cb, notifyInSync?)`、`subscribeKey(key, cb)`、`subscribeKeys(keys, cb)`
- **写**：`set(key, value)`、`update(partial)`、`setNested(path, value)`、`delete(key)`、`reset(initialState)`
- **工具**：`ref(value)`、`batch(fn)`、`clone()`、`toJSON()`、`fromJSON(json)`、`persist(key)`、`debug(label?)`

### 持久化

```ts
const store = createStore({ theme: 'light' })
store.persist('app-settings')  // 与 localStorage 双向同步，返回 Unsubscribe
```

### 集合

```ts
import { createMap, createSet } from '@empjs/valtio'
const map = createMap<string, number>([['a', 1]])
const set = createSet<number>([1, 2, 3])
// 可放入 createStore 初始状态或 useStore，响应式更新
```

## 调用闭环（重要）

1. **读**：只用 `snap`（来自 `store.useSnapshot()` 或 `useStore` 的 `snap`），不要直接读 `store.xxx` 做渲染，否则不触发订阅。
2. **写**：用 store 方法（`set`、`update`、`store.key = value` 等），写后所有订阅该路径的组件会重渲染。
3. **历史 store**：读用 `snap.value.xxx`，写用 `store.value.xxx = y`；撤销/重做用 `snap.undo()` / `snap.redo()` 或 `store` 上的方法（视版本而定，以类型为准）。

## 与 Valtio 原生对比

- 本库在内部使用 `valtio` 的 `proxy`、`snapshot`、`subscribe`、`useSnapshot` 等，并依赖 `valtio/utils`（deepClone、devtools、proxyMap、proxySet、subscribeKey）、`valtio-history`、`derive-valtio`。
- 从 `@empjs/valtio` 可再导出原生：`proxy`、`snapshot`、`subscribe`、`subscribeKey`、`ref`、`useSnapshot`、`proxyWithHistory`、`proxyMap`、`proxySet`、`derive`、`devtools`。
- 增强点：无需手写 `proxy` + 一堆方法；`createStore` / `useStore` 统一返回带方法的 store；历史支持 `limit`；派生与历史均可与 createStore/useStore 组合。

## 常见错误与注意点

- **"Please use proxy object"**：在传给 `snapshot`/`useSnapshot`/`subscribe` 的地方必须传 proxy（即 createStore/useStore 返回的 store 或 base），不要传普通对象。`enhanceStore` 内部用闭包固定了 store 引用，对外方法都转发到该 proxy。
- **派生函数签名**：`derive: (get, proxy) => derivedObject`，其中 `get(proxy)` 得到当前快照，派生结果必须是纯对象（可含计算属性），不要在其中写副作用。
- **历史 limit**：仅在 `history: { limit: n }` 且 n > 0 时生效，由本库在 subscribe 中裁剪节点；不传 limit 或 0 表示不限制步数。

## 类型要点（TypeScript）

- `createStore(initialState)` 返回 `T & StoreBaseMethods<T>`；带 `history` 返回 `HistoryStoreWithSnapshot<T>`；带 `derive` 返回 `{ base, derived }`（`StoreWithDerived<T, D>`）。
- `useStore` 常规返回 `[Snapshot<T>, T & StoreBaseMethods<T>]`；带 derive 返回 `[Snapshot<T>, T & StoreBaseMethods<T>, D]`；带 history 返回 `[WithHistorySnapshot<T>, HistoryStore<T>]`。
- 初始状态可用 `InitialStateOrFn<T>`（即 `T | (() => T)`）做惰性初始化。

更细的 API 与选项见 [references/api.md](references/api.md)。
