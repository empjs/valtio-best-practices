# @empjs/valtio API 参考

基于 `packages/valtio/src/index.ts` 与 Valtio v2 的导出与类型整理。

## 目录

1. [类型](#类型)
2. [createStore](#createstore)
3. [useStore](#usestore)
4. [StoreBaseMethods](#storebasemethods)
5. [增强 Store / History / Derive](#增强-store--history--derive)
6. [集合与再导出](#集合与再导出)

---

## 类型

| 类型 | 说明 |
|------|------|
| `Unsubscribe` | `() => void`，取消订阅 |
| `InitialStateOrFn<T>` | `T \| (() => T)`，初始状态或惰性函数 |
| `DeriveFn<TProxy, TDerived>` | `(get, proxy) => TDerived`，派生函数 |
| `CreateOptionsBase` | `{ devtools?: boolean; name?: string }` |
| `WithHistoryOptions` | `{ limit?: number }` 等（与 valtio-history 兼容） |
| `CreateOptions<T, D>` | Base + `history?` + `derive?` |
| `WithHistorySnapshot<T>` | `{ value, history, isUndoEnabled, isRedoEnabled, undo, redo }` |
| `StoreWithDerived<T, D>` | `{ base: T & StoreBaseMethods<T>; derived: object & { useSnapshot(): D } }` |

---

## createStore

```ts
function createStore<T>(initialState: T, options?: CreateOptionsBase): T & StoreBaseMethods<T>
function createStore<T>(initialState: T, options: { history: WithHistoryOptions }): HistoryStoreWithSnapshot<T>
function createStore<T, D>(initialState: T, options: { derive: DeriveFn<T, D> }): StoreWithDerived<T, D>
```

- **常规**：`options` 可选，支持 `devtools`、`name`；开发环境默认挂 devtools（可 `devtools: false` 关闭）。
- **history**：与 `valtio-history` 的 `proxyWithHistory` 一致，本库额外支持 `limit` 自动裁剪历史节点。
- **derive**：使用 `derive-valtio`，返回 `{ base, derived }`；base 写、derived 只读派生。

---

## useStore

```ts
function useStore<T>(initialState: InitialStateOrFn<T>): [Snapshot<T>, T & StoreBaseMethods<T>]
function useStore<T>(initialState: InitialStateOrFn<T>, options: { history: WithHistoryOptions }): [WithHistorySnapshot<T>, HistoryStore<T>]
function useStore<T, D>(initialState: InitialStateOrFn<T>, options: { derive: DeriveFn<T, D> }): [Snapshot<T>, T & StoreBaseMethods<T>, D]
```

- 组件内每实例独立 store；`initialState` 可为函数实现惰性初始化。
- **useStore 的 options** 仅支持 `history`、`derive`，无 `devtools`/`name`。

---

## StoreBaseMethods

增强后 store 上的方法（`createStore` 常规返回与 `useStore` 返回的 store 均具备）：

| 方法 | 签名 | 说明 |
|------|------|------|
| `getSnapshot` | `() => Snapshot<T>` | 当前只读快照 |
| `useSnapshot` | `() => Snapshot<T>` | React 内订阅用 |
| `subscribe` | `(cb, notifyInSync?) => Unsubscribe` | 全量订阅 |
| `subscribeKey` | `(key, cb) => Unsubscribe` | 单 key 订阅 |
| `subscribeKeys` | `(keys, cb) => Unsubscribe` | 多 key 订阅，cb(key, value) |
| `update` | `(partial: Partial<T>) => void` | 批量更新 |
| `set` | `(key, value) => void` | 单字段更新 |
| `setNested` | `(path: string, value) => void` | 点号路径更新 |
| `delete` | `(key) => void` | 删除字段 |
| `reset` | `(initialState: T) => void` | 重置为初始状态（仅清数据字段，保留方法） |
| `ref` | `(value) => value` | 存非代理引用（valtio `ref`） |
| `batch` | `(fn: (store) => void) => void` | 批量写（单次调度） |
| `clone` | `() => T & StoreBaseMethods<T>` | deepClone 快照后新 proxy + 增强 |
| `toJSON` | `() => Record<string, unknown>` | 可序列化字段（去掉 function/symbol） |
| `fromJSON` | `(json) => void` | 从对象写回 store |
| `persist` | `(key: string) => Unsubscribe` | localStorage 双向同步 |
| `debug` | `(label?) => void` | console 打印当前快照 |

---

## 增强 Store / History / Derive

- **enhanceStore**：内部使用，为 `proxy` 挂载上述 `StoreBaseMethods`，对外通过 `createStore`/`useStore` 暴露。
- **History**：`createStore(..., { history })` 或 `useStore(..., { history })`；读用 `snap.value`，写用 `store.value.xxx`；撤销/重做见 `WithHistorySnapshot`。
- **Derive**：`derive(get, proxy)` 中 `get(proxy)` 取当前快照；返回对象会变为派生 proxy，仅读、自动随 base 更新。

---

## 集合与再导出

- **createMap** / **createSet**：对 `valtio/utils` 的 `proxyMap`、`proxySet` 的封装，用于在 store 或组件内做响应式 Map/Set。
- **再导出**（可从 `@empjs/valtio` 直接使用）：`proxy`、`snapshot`、`subscribe`、`subscribeKey`、`ref`、`useSnapshot`、`proxyWithHistory`、`proxyMap`、`proxySet`、`derive`、`devtools`。
