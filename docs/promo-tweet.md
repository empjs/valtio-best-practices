# @empjs/valtio 让 Valtio 开箱即用、少写一半代码

@empjs/valtio 是 [Valtio](https://github.com/pmndrs/valtio) 的增强版状态库：在保留细粒度响应式与快照语义的前提下，**单包内建** createStore / useStore、**17 个 Store 方法**、历史回溯、派生状态、持久化、createMap/createSet；典型场景减少约 40%～50% 样板，接入步骤从多步收敛为一步。**微前端友好**：子应用可独立 useStore，主机通过 **props 传 store** 即可与远程组件共享状态，无需 Context 与事件总线。下文以产品能力为中心，用代码展示其强大与用法。

---

## 从原版 Valtio 到增强 Store

### 原版 Valtio：最少可用写法

原版 Valtio 只提供 `proxy` 与 `useSnapshot`。要实现「全局 store + 组件内读 snap + 写」必须自己把 proxy 包一层，否则写操作分散在业务里，难以统一约束（例如要做持久化、历史、batch 时就要到处改）。

```tsx
// 原版 Valtio：至少需要这些
import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'

const state = proxy({ count: 0, name: '' })

// 写操作要么直接改 proxy（业务里散落 state.count++）
// 要么自己封装 set/update，否则后续加 persist/history 要改无数处
function set(key: keyof typeof state, value: unknown) {
  (state as Record<string, unknown>)[key] = value
}
function update(partial: Partial<typeof state>) {
  Object.assign(state, partial)
}

function Counter() {
  const snap = useSnapshot(state)  // 必须记得：读只用 snap，不能读 state
  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
```

**原版痛点**：**（1）store 形态是裸 proxy，没有统一「写入口」；（2）set/update 要自己写并和 proxy 绑在一起；（3）每个用到 store 的组件都要单独 import useSnapshot 和 state；（4）若要做历史、派生、持久化，需再接 valtio-history、derive-valtio 并自写 persist，接入步骤多、易漏。**

### @empjs/valtio：同一需求的写法

同一需求下，增强库把「创建 + 读快照 + 写入口」收束为一个 store 对象，组件只依赖「从哪拿 snap、从哪写」。

```tsx
// @empjs/valtio
import { createStore } from '@empjs/valtio'

const store = createStore({ count: 0, name: '' })

function Counter() {
  const snap = store.useSnapshot()
  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
```

**产品能力**：**（1）store 即「状态 + 读/写 API」一体，set/update/reset/persist 等全在 store 上，加能力不改业务调用点；（2）组件内只认 store 与 snap，闭环清晰：读用 snap、写用 store；（3）原版需 10+ 行自封装的边界，这里约 6 行达成，样板减少约 40%～50%，类型由 createStore 推断，无需手写 set 签名。**

---

## 量化对比

| 维度 | 原版 Valtio | @empjs/valtio | 代码依据 |
|------|-------------|----------------|----------|
| **「全局 store + 读 + 写」行数** | 约 10～14 行（proxy + 自封装 set/update + 组件内 useSnapshot） | 约 5～7 行（createStore + 组件内 useSnapshot + store.set） | 见上一节两段代码 |
| **Store 自带方法数** | 0（需自封装） | **17**（getSnapshot、useSnapshot、subscribe、subscribeKey、subscribeKeys、set、update、setNested、delete、reset、ref、batch、clone、toJSON、fromJSON、persist、debug） | 见 `StoreBaseMethods<T>` |
| **历史 + 派生 + 持久化** | 安装 valtio-history、derive-valtio，自写 persist 与封装，约 4～5 步 | **1 步**：`createStore(init, { history, derive })` + `store.persist(key)` | 见下段代码 |

```tsx
// @empjs/valtio：历史 + 派生 + 持久化 一次到位
const store = createStore(
  { firstName: '', lastName: '' },
  {
    history: { limit: 50 },
    derive: (get, proxy) => ({
      fullName: `${get(proxy).firstName} ${get(proxy).lastName}`.trim(),
    }),
  }
)
store.persist('user-form')
// 组件内：snap.value、snap.undo/redo、derived.useSnapshot() 等均已可用
```

**能力收口**：历史、派生、持久化通过「一个 createStore + options」和「store 上的方法」一次到位，步骤从 4～5 步降为 1 步，可维护性与一致性更强。

---

## 调用闭环：读 snap、写 store

Valtio 的响应式建立在「对 proxy 的读」上；在 React 里若用 `useSnapshot(store)`，只有对 **返回的 snap** 的读会参与依赖收集，直接读 `store.xxx` 做渲染不会触发订阅更新。因此「读用 snap、写用 store」是硬约束，不是风格问题。

```tsx
// ❌ 错误：读 store 做渲染，不会触发重渲染
function Bad() {
  const snap = store.useSnapshot()
  return <span>{store.count}</span>  // 应读 snap.count
}

// ✅ 正确：读 snap、写 store
function Good() {
  const snap = store.useSnapshot()
  return (
    <>
      <span>{snap.count}</span>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    </>
  )
}
```

@empjs/valtio 的 Store 类型把「可读快照」与「可写方法」放在同一个对象上，但通过文档与类型约束「读用 useSnapshot() 的返回值、写用 store 的方法」，子组件只要收到 `EmpStore<T>`，就能在类型层面统一「可写入口」，避免误用。类型设计上建议：`const initialState = { ... }`、`type State = typeof initialState`、`export type Store = EmpStore<State>`，子组件只依赖 `Store`，改形状只改 initialState 一处。

---

## 局部 Store 与多实例

在表单、编辑器、画板等场景，同一组件会挂多个实例，每个实例应有独立状态。若用「全局单例 store」，要么为每个实例手动 new 一个 store 再通过 props 或 context 传下去（繁琐且易漏），要么误用同一个 store 导致多实例共享状态。

```tsx
// @empjs/valtio：每实例独立，无需手动建多个 store
function FormBlock({ initialLabel }: { initialLabel: string }) {
  const [snap, store] = useStore({ count: 0, label: initialLabel })
  return (
    <div>
      <p>{snap.label}: {snap.count}</p>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
      <button onClick={() => store.reset({ count: 0, label: initialLabel })}>Reset</button>
    </div>
  )
}

// 使用：两个实例状态完全隔离
<FormBlock initialLabel="A" />
<FormBlock initialLabel="B" />
```

**产品能力**：**useStore(initialState)** 语义清晰——该组件实例拥有从 initialState 派生的 store，生命周期与实例绑定，卸载即释放。无需在模块层维护多实例数组或 Map，也无全局单例复用导致的状态串扰，尤其适合微前端下各子应用「各自一份局部状态」。

---

## 微前端与 props 传导

微前端下常见问题：**（1）子应用/远程组件若依赖主机提供的「全局单例 store」，则与主机强耦合、版本与构建顺序敏感；（2）若用事件总线或 postMessage 同步状态，类型弱、边界模糊、调试难。**

**产品能力**：**把 store 当普通 props 从主机传到子/远程组件**即可：（1）子组件不关心「谁创建的 store」，只依赖类型 `EmpStore<State>`；（2）主机与子应用之间只需「传一个 store 引用」，无全局单例、无事件名约定；（3）子应用内部仍可用自己的 `useStore` 做局部状态，与主机下发的 store 泾渭分明。

下面用代码展示「主机持有 store，通过 props 传给远程组件」的形态；类型用 `typeof initialState` + `export type Store = EmpStore<State>`，子组件只消费 `Store`，便于独立构建与类型检查。

```tsx
// 主机或共享层：定义初始状态与 Store 类型，导出类型供子应用使用
const initialState = { count: 10, name: 'parent', loading: false }
type State = typeof initialState
export type Store = EmpStore<State>

// 主机侧：createStore 或 useStore 得到 store，通过 props 传给远程/子组件
function Host() {
  const [snap, store] = useStore<State>(initialState)
  return (
    <div>
      <RemoteChild store={store} />
    </div>
  )
}

// 远程/子应用组件：只依赖 Store 类型，不依赖主机实现
function RemoteChild({ store }: { store: Store }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <span>{snap.count}</span>
      {snap.loading && <span>加载中…</span>}
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
      <button onClick={() => store.reset({ count: 0, name: '', loading: false })}>Reset</button>
    </div>
  )
}
```

**能力总结**：**（1）局部独立**：子应用内部 `useStore(...)` 即得独立 store，不碰主机单例；**（2）props 传导**：主机把 store 当 prop 传入，子组件收 `store: Store` 即可读 snap、写 set/update/reset；**（3）类型边界清晰**：子应用只依赖共享的 `State`/`Store` 类型（可来自共享包或类型导出），不依赖主机运行时，适合 Module Federation 的独立部署与按需加载。

---

## 最佳实战（参考官网「实战」页）

官网 [valtio.empjs.dev](https://valtio.empjs.dev/) 的「实战」页按实践优先级整理了七条最佳实战：调用闭环（必守）→ 类型与选型 → 常规/全局/组件通信 → 常见错误。**具体使用方法**（Store 方法说明与带注释代码）见「使用」页：[valtio.empjs.dev/manual](https://valtio.empjs.dev/manual)。下面逐条展开，并辅以代码说明。

### 1. 调用闭环（必守）

每次写组件都要遵守：**读只用 snap，写用 store 方法**；否则订阅不更新。历史 store 下：读用 `snap.value.xxx`，写用 `store.value.xxx`，撤销/重做用 `snap.undo()` / `snap.redo()`。

```tsx
// 常规：读 snap，写 store
const snap = store.useSnapshot()
return <span>{snap.count}</span>
store.set('count', snap.count + 1)
store.update({ name: 'Alice' })

// 历史 store：读 snap.value，写 store.value
const snap = store.useSnapshot()
return <span>{snap.value.count}</span>
store.value.count = snap.value.count + 1
snap.undo()
```

### 2. 类型：EmpStore\<T\>

用 `EmpStore<T>` 标注「状态 + 增强方法」，不要手写 `interface MyStore { useSnapshot(): ...; set(): ... }`，易漏方法。推荐：`const initialState = { ... }`、`type State = typeof initialState`、`export type Store = EmpStore<State>`，改形状只改 initialState 一处，子组件 props 用 `Store`。

```tsx
import { type EmpStore, createStore, useStore } from '@empjs/valtio'

const initialState = { count: 0, name: '' }
type State = typeof initialState
export type Store = EmpStore<State>
```

### 3. 选型：createStore vs useStore

| 场景 | 使用 |
|------|------|
| 单例、跨组件共享（主题、用户、全局计数） | `createStore(initialState, options?)` |
| 组件内独立状态、每实例一份（表单、编辑器、画板） | `useStore(initialState, options?)` |

### 4. 常规 Store

**createStore**：模块级单例，跨组件共享。读用 `store.useSnapshot()`，写用 `store.set` / `store.update`。**useStore**：组件内每实例独立，返回 `[snap, store]`，读用 snap、写用 store；`initialState` 可为函数实现惰性初始化。

```tsx
// 全局单例
const store = createStore({ count: 0, name: '' })

// 组件内每实例（局部）
const [snap, localStore] = useStore({ count: 0 })
// 惰性初始化
const [snap, localStore] = useStore(() => ({ count: 0 }))
```

### 5. 全局 Store

跨组件共享时用 `createStore`，返回类型即 `EmpStore<T>`（自动推导），无需再手写类型。

```tsx
const globalStore = createStore({ count: 0, name: 'global' })
// 类型为 EmpStore<{ count: number; name: string }>
```

### 6. 组件通信（Parent → Child）

父组件 `useStore<State>(initialState)` 得 `[snap, store]`，将 **store 通过 props 传给子组件**；子组件 props 收 `Store`（即 `EmpStore<State>`），内部 `store.useSnapshot()` 读、`store.set` / `store.reset` / `store.key = value` 写。initialState 可含异步方法，`this` 指向 store，便于封装请求与 loading 状态。

```tsx
const initialState = {
  count: 10,
  name: 'parent',
  loading: false,
  async fetchUser() {
    this.loading = true
    const res = await fetch('/api/user')
    const data = await res.json()
    this.name = data.name
    this.loading = false
  },
}
type State = typeof initialState
export type Store = EmpStore<State>

function Child({ store }: { store: Store }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <span>{snap.count}</span>
      {snap.loading && <span>加载中…</span>}
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
      <button onClick={() => store.fetchUser()}>请求用户</button>
      <button onClick={() => store.reset({ count: 0, name: '', loading: false })}>Reset</button>
    </div>
  )
}

function Parent() {
  const [snap, store] = useStore<State>(initialState)
  return <Child store={store} />
}
```

要点：读只用 snap，写用 store 方法或 `store.key = value`。

### 7. 常见错误与注意点

- **"Please use proxy object"**：传给 `useSnapshot` / `subscribe` 的必须是 proxy（createStore/useStore 返回的 store 或 base），不要传普通对象。
- **派生函数签名**：`derive: (get, proxy) => derivedObject`，`get(proxy)` 得当前快照，返回纯对象，不要写副作用。
- **集合 key 名勿用 "set"**：会与 `store.set(key, value)` 方法冲突。

```tsx
// ✅ 正确：store 是 proxy
const snap = store.useSnapshot()

// ❌ 错误：plainObject 不是 proxy（useSnapshot/subscribe 同理，须传 store）
const snapBad = snapshot(plainObject)  // 若从 valtio 引入 snapshot

// derive：返回纯对象，无副作用
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }
)

// 集合 key 勿用 "set"
const store = createStore({
  map: createMap(),
  // set: createSet(),  // BAD：与 store.set 冲突
  tagSet: createSet(),  // OK
})
```

以上七条与官网「实战」页一致。**具体使用方法**（Store 方法说明与带注释代码）见官网「使用」页：[valtio.empjs.dev/manual](https://valtio.empjs.dev/manual)。

---

## 总结

- **增强 Store 的能力**：原版 Valtio 仅提供 proxy + useSnapshot，写入口与历史/派生/持久化需自封装或拼多包；@empjs/valtio 单包内建 createStore/useStore、17 个 Store 方法及历史/派生/持久化/集合，典型场景减少约 40%～50% 样板，接入步骤从 4～5 步收敛为 1 步。
- **调用闭环**：读只用 snap、写用 store 是硬约束，否则订阅不更新；类型用 `typeof initialState` + 导出 `Store`，子组件只依赖 Store，改形状只改 initialState 一处。
- **全局与局部**：单例、跨组件共享用 createStore；组件内每实例一份（表单、编辑器、画板）用 useStore，生命周期与实例绑定，无需在模块层维护多实例。
- **微前端与 props 传导**：子应用可独立 useStore 不碰主机单例；主机通过 props 把 store 传给远程组件，子组件只认 `EmpStore<State>` 类型，无全局单例、无事件总线，边界清晰，适合 Module Federation。
- **后续**：最佳实战七条见官网「实战」页；具体使用方法（Store 方法说明与带注释代码）见 [valtio.empjs.dev/manual](https://valtio.empjs.dev/manual)。
