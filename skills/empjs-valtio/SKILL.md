---
name: empjs-valtio
description: "React 全局/局部 proxy 状态库：createStore、useStore、EnhancedStore，支持历史、派生、持久化、Map/Set、订阅与 batch。"
---

# @empjs/valtio Skill

基于 **Valtio v2** 的增强状态库，在 `proxy` + `useSnapshot` 之上提供开箱即用的 `createStore` / `useStore`、历史、派生、持久化与 Store 方法封装。

## 何时用 createStore vs useStore

| 场景 | 使用 |
|------|------|
| 单例、跨组件共享（如主题、用户、全局计数） | `createStore(initialState, options?)` |
| 组件内独立状态、每实例一份（表单、编辑器、画板） | `useStore(initialState, options?)` |

## 类型与组件通信（EnhancedStore）

- **类型**：用 `EnhancedStore<T>` 表示「状态 + 增强方法」，不要手写 `interface MyStore { useSnapshot(): ...; set(): ... }`；`createStore` / `useStore` 返回的 store 即 `EnhancedStore`。
- **全局 Store**：`createStore(initialState)` 得到单例 EnhancedStore，跨组件共享。
- **父传子**：子组件 props 收 `EnhancedStore<MyState>`，内部用 `store.useSnapshot()` 读、`store.set` / `store.reset` / 直接写 `store.key` 写；父组件 `useStore(...)` 得到 `[snap, store]`，把 `store` 传给子组件即可。调用闭环、选型与常见错误等按权重排序见 [references/best-practices.md](references/best-practices.md)。

## 按使用方法速查

| 用法 | 说明 | 详见 |
|------|------|------|
| 常规 store | 读 `useSnapshot()` / `snap`，写 `set` / `update` | [usage.md](references/usage.md#1-常规-store) |
| 带历史 | `history: {}`，读 `snap.value`，写 `store.value.xxx`，`snap.undo()` / `snap.redo()`，`snap.history.nodes.length` 为步数 | [usage.md](references/usage.md#2-带历史的-store) |
| 带派生 | `derive: (get, proxy) => ({ ... })`，返回 `{ base, derived }` 或 `[baseSnap, baseStore, derivedSnap]` | [usage.md](references/usage.md#3-带派生的-store) |
| 集合 Map/Set | `createMap` / `createSet` 放入 store 或 useStore，读 `snap.map.get` / `snap.tagSet.has`，写 `store.map.set` / `store.tagSet.add` | [usage.md](references/usage.md#4-集合-createmapcreateset) |
| 持久化 | `store.persist('key')` 与 localStorage 双向同步 | [usage.md](references/usage.md#5-持久化) |
| 订阅 | `subscribe` / `subscribeKey` / `subscribeKeys`、`batch(fn)` 合并多次写为一次通知 | [usage.md](references/usage.md#6-订阅与-batch) |

## 调用闭环（重要）

1. **读**：只用 `snap`（来自 `store.useSnapshot()` 或 `useStore` 的 `snap`），不要直接读 `store.xxx` 做渲染，否则不触发订阅。
2. **写**：用 store 方法（`set`、`update`、`store.key = value` 等），写后所有订阅该路径的组件会重渲染。
3. **历史 store**：读用 `snap.value.xxx`，写用 `store.value.xxx = y`；撤销/重做用 `snap.undo()` / `snap.redo()`；当前记录步数可用 `snap.history?.nodes?.length`。

## 常见错误与注意点

- **"Please use proxy object"**：传给 `snapshot`/`useSnapshot`/`subscribe` 的必须是 proxy（createStore/useStore 返回的 store 或 base），不要传普通对象。
- **派生函数签名**：`derive: (get, proxy) => derivedObject`，`get(proxy)` 得当前快照，返回纯对象，不要写副作用。
- **集合 key 名**：勿用 key 名 `"set"`，会与 `store.set(key, value)` 方法冲突。

## 类型要点（TypeScript）

- **推荐**：用 `EnhancedStore<T>` 表示「状态 + 增强方法」；`createStore` 常规返回即 `EnhancedStore<T>`（等价于 `T & StoreBaseMethods<T>`）。
- `createStore(initialState)` → `EnhancedStore<T>`；带 `history` → `HistoryStoreWithSnapshot<T>`；带 `derive` → `{ base, derived }`。
- `useStore` 常规 → `[Snapshot<T>, EnhancedStore<T>]`；带 derive → `[Snapshot<T>, EnhancedStore<T>, D]`；带 history → `[WithHistorySnapshot<T>, HistoryStore<T>]`。
- 初始状态可用 `InitialStateOrFn<T>`（即 `T | (() => T)`）惰性初始化。

## 更多资源

- **最佳实践（按权重：闭环 → 类型/选型 → 常用用法 → 常见错误）**：[references/best-practices.md](references/best-practices.md)
- **按使用方法详细说明**：[references/usage.md](references/usage.md)
- **API 与类型**：[references/api.md](references/api.md)
- **示例（按用法分文件）**：[examples/index.md](examples/index.md) — 含 [best-practices](examples/best-practices.md)、[regular](examples/regular.md)、[history](examples/history.md)、[derive](examples/derive.md)、[async](examples/async.md)、[collections](examples/collections.md)、[persist](examples/persist.md)、[subscribe](examples/subscribe.md)、[performance](examples/performance.md)
