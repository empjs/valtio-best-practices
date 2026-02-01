# @empjs/valtio：Valtio 的生产级增强——单包收束全部写入口与能力扩展

> **@empjs/valtio** 在保留 Valtio 细粒度响应式与快照语义的核心的前提下，单包内建 `createStore` / `useStore`、**17 个 Store 方法**、历史回溯、派生状态、持久化、集合类型；典型场景样板代码量减少 **40%～50%**，"全局 store + 读写 + 历史/派生/持久化"的接入路径从 **4～5 步收敛为 1 步**。微前端场景下子应用可通过 **props 传导 store**，无需事件总线与全局单例耦合。

---

## 目录

0. [背景：为什么 Valtio，为什么需要增强](#0-背景)
1. [核心对比：原版 Valtio vs @empjs/valtio](#1-核心对比)
2. [调用闭环——响应式的硬约束](#2-调用闭环)
3. [Store 能力图谱：17 个方法分类详解](#3-store-能力图谱)
4. [全局 Store 与局部 Store 的选择](#4-全局-store-与局部-store)
5. [微前端与 props 传导](#5-微前端与-props-传导)
6. [常见错误避雷](#6-常见错误避雷)
7. [场景矩阵：快速选型](#7-场景矩阵)

---

## 0. 背景

### 0.1 React 状态管理的演变

React 生态的状态管理库按核心机制可归为三类：

| 范式 | 代表库 | 核心机制 | 典型特征 |
|------|--------|----------|----------|
| **Reducer 型** | Redux / Redux Toolkit | 不可变状态 + 动作分发 + Reducer 纯函数 | 可预测、可调试、样板多；适合大型团队协作 |
| **Atom 型** | Jotai / Recoil | 细粒度原子状态 + 依赖图自动追踪 | 按原子粒度重渲染；适合状态互依复杂的场景 |
| **Proxy 型** | MobX / **Valtio** | 可变 Proxy + 自动订阅 | 代码最接近原生 JS 对象操作；样板最少 |

Reducer 型长期占据主导，但随着项目规模分化，开发者对样板代码和学习曲线的容忍度急剧下降。Zustand（约 1KB）的崛起证明了「极小 API + 较少约束」对中小项目的吸引力；而 Valtio 则走得更远——它完全省掉了 action/reducer/selector 等概念，让状态变更看起来就像普通 JS 对象赋值。

### 0.2 Valtio 的设计哲学

Valtio 由 pmndrs（poimandres，开源集体，同为 Zustand、react-three-fiber 等库的作者）创建，核心理念是：

**"让 Proxy 状态对 React 开发者透明。"**

它只暴露两个核心 API：
- `proxy(initialState)` — 创建响应式状态对象；写入即像普通对象赋值 `state.count++`
- `useSnapshot(state)` — 在组件内获取当前快照，参与 React 的依赖收集与重渲染

这种设计带来了显著优势：组件只需访问自己用到的属性就能自动获得精细粒度的重渲染优化（基于 `proxy-compare` 的访问追踪），无需手写 selector。与此同时，状态变更可以发生在任何地方——事件处理器、定时器、异步函数——无需经过固定的分发机制。

### 0.3 Valtio 的能力边界与增强的契机

Valtio 的极简主义是双刃剑。它刻意只提供「构建块」而非「完整框架」：

- **没有统一的写入口。** 原版鼓励直接 `state.xxx = value`，但一旦团队规模增大，写操作散落在业务代码各处，历史追踪、持久化、批量更新等横截面能力就无法统一拦截。
- **没有内建的 store 对象。** `proxy` 返回的是裸状态，要做到「读写闭环」需要开发者自己封装 set/update 工具函数并与 proxy 绑定。
- **历史、派生、持久化均需外接。** 要实现撤销/重做需安装 `valtio-history`，派生状态需 `derive-valtio`，持久化需自写 localStorage 逻辑——每个能力都是独立的接入步骤。
- **多实例场景繁琐。** 原版没有针对「每组件实例拥有独立状态」的原生支持，需要借助 `useRef(proxy(...))` + Context 手动传导，容易漏掉清理逻辑。

这些不是 Valtio 的设计缺陷，而是其极简定位的自然边界。**@empjs/valtio 的增强正是在这些边界之外，以 Valtio 的 proxy + snapshot 机制为基础，补齐写入口、能力扩展和多实例工作流。**

---

## 1. 核心对比

### 1.1 同一需求，两种写法

以「全局计数器」为例，放置在同一屏幕内对比写法差异。

**原版 Valtio：** proxy 裸导出，写入口需自手动封装，组件内每次都要同时 import `proxy` 对象和 `useSnapshot`。

```tsx
// 原版 Valtio
import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'

const state = proxy({ count: 0, name: '' })

// 没有统一写入口，需自封装
function set<K extends keyof typeof state>(key: K, value: typeof state[K]) {
  state[key] = value
}
function update(partial: Partial<typeof state>) {
  Object.assign(state, partial)
}

function Counter() {
  const snap = useSnapshot(state)
  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
// 总行数：约 14 行（含 import、自封装、组件）
// 若需历史/派生/持久化：需额外安装 valtio-history、derive-valtio，自写 persist 逻辑
```

**@empjs/valtio：** `createStore` 将「创建 + 写入口 + 读快照」收束为一个对象。

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
// 总行数：约 7 行（含 import、createStore、组件）
// 历史/派生/持久化：无需额外安装，见下节
```

### 1.2 量化对比表

| 维度 | 原版 Valtio | @empjs/valtio | 说明 |
|------|:-----------:|:-------------:|------|
| **最小可用写法行数**（全局 store + 读写） | ~14 行 | ~7 行 | 含 import、状态定义、组件；原版需自封装 `set`/`update` |
| **Store 自带方法数** | 0 | **17** | 见 §3 方法分类表 |
| **接入历史+派生+持久化** | 4～5 步 | **1 步** | 原版：① npm install valtio-history ② npm install derive-valtio ③ 手写 persist 逻辑 ④ 在组件/模块内分别接入各插件 ⑤ 手动维护撤销/重做调用；增强版：`createStore(init, { history, derive })` + `store.persist(key)` |
| **类型推断** | 需手写 `set` 签名 | 自动推断，零手写 | `createStore` 泛型链完整推导键与值类型 |
| **多实例状态隔离** | 需手动 `new` 多个 proxy + context/props 传导 | `useStore()` 每实例自动独立 | 生命周期与组件实例绑定 |

### 1.3 历史 + 派生 + 持久化：一步到位

原版需安装并分别接入至少 3 个包/逻辑，@empjs/valtio 通过 `createStore` 的 `options` 参数和 store 方法一次激活。

```tsx
const store = createStore(
  { firstName: '', lastName: '' },
  {
    history: { limit: 50 },                       // 开启历史，保留最近 50 步
    derive: (get, proxy) => ({
      fullName: `${get(proxy).firstName} ${get(proxy).lastName}`.trim(),
    }),                                            // 派生状态，自动响应变化
  }
)
store.persist('user-form')                         // 持久化，一行搞定

// 组件内使用：
// 读当前值        → snap.value.firstName
// 写入新值        → store.value.firstName = 'Alice'
// 撤销/重做       → snap.undo() / snap.redo()
// 读派生值        → derived.useSnapshot().fullName
```

---

## 2. 调用闭环

> **核心规则：读用 snap，写用 store。** 这是响应式系统的硬约束，不是代码风格建议。

Valtio 的响应式依赖 React 对 `useSnapshot` 返回值的读操作来进行依赖收集。直接在渲染中读取 `store.xxx` **不会**触发重渲染。

```tsx
// ❌ 错误：读 store 不参与订阅，不会触发重渲染
function Bad() {
  store.useSnapshot()                        // 调用了 hook，但未使用返回值读数据
  return <span>{store.count}</span>         // 读的是 proxy，不是 snap
}

// ✅ 正确：读 snap，写 store
function Good() {
  const snap = store.useSnapshot()
  return (
    <>
      <span>{snap.count}</span>                                  {/* 读 snap */}
      <button onClick={() => store.set('count', snap.count + 1)}>  {/* 写 store */}
        +1
      </button>
    </>
  )
}
```

**历史 store 下的闭环规则**也一致，仅多了一层 `.value` 包裹：

| 操作 | 写法 |
|------|------|
| 读当前状态 | `snap.value.xxx` |
| 写入状态 | `store.value.xxx = newVal` |
| 撤销 | `snap.undo()` |
| 重做 | `snap.redo()` |

**类型层面的约束设计：** 子组件 props 声明为 `EmpStore<State>`，则只能通过 store 上的方法写入，无法绕过闭环。推荐写法如下：

```tsx
import { type EmpStore } from '@empjs/valtio'

const initialState = { count: 0, name: '' }
type State = typeof initialState
export type Store = EmpStore<State>   // 子组件只依赖此类型
// 改变状态结构 → 只需修改 initialState，类型自动同步
```

---

## 3. Store 能力图谱

`createStore` / `useStore` 返回的对象内建 **17 个方法**，分为以下四类：

### 3.1 读取

| 方法 | 用途 |
|------|------|
| `useSnapshot()` | React Hook，返回当前快照，参与依赖收集 |
| `getSnapshot()` | 非 Hook 场景读取快照（如事件回调、工具函数） |
| `toJSON()` | 序列化当前状态为纯对象 |

### 3.2 写入

| 方法 | 用途 |
|------|------|
| `set(key, value)` | 设置单个键值 |
| `update(partial)` | 合并部分状态（浅合并） |
| `setNested(path, value)` | 深路径写入，如 `store.setNested('a.b.c', 1)` |
| `delete(key)` | 删除某个键 |
| `reset(initialState?)` | 重置为初始状态或指定状态 |
| `fromJSON(json)` | 从序列化对象恢复状态 |

### 3.3 订阅

| 方法 | 用途 |
|------|------|
| `subscribe(callback)` | 监听整体状态变化 |
| `subscribeKey(key, callback)` | 监听单个键变化 |
| `subscribeKeys(keys, callback)` | 监听多个键变化 |

### 3.4 工具

| 方法 | 用途 |
|------|------|
| `ref(value)` | 标记为非响应式引用（如 DOM 节点、第三方实例） |
| `batch(fn)` | 批量执行多次写入，仅触发一次更新 |
| `clone()` | 深拷贝当前状态为新对象 |
| `persist(key)` | 启用 localStorage 持久化 |
| `debug()` | 开启控制台状态变更日志 |

---

## 4. 全局 Store 与局部 Store

### 选择依据

| 场景特征 | 使用方式 | 示例场景 |
|----------|----------|----------|
| 单例、跨组件共享 | `createStore(init)` | 主题配置、当前用户、全局计数 |
| 每实例独立状态 | `useStore(init)` | 表单、编辑器、画板 |

### useStore：每实例自动隔离

`useStore` 在每个组件实例挂载时独立创建 store，卸载时自动释放，无需在模块层维护实例数组或 Map。

```tsx
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

// 两个实例，状态完全隔离
<FormBlock initialLabel="A" />
<FormBlock initialLabel="B" />
```

`initialState` 支持传入函数实现**惰性初始化**，适合初始值需要异步获取或计算代价较高的场景：

```tsx
const [snap, store] = useStore(() => ({ count: expensiveCompute() }))
```

---

## 5. 微前端与 props 传导

### 问题背景

| 常见做法 | 缺陷 |
|----------|------|
| 子应用依赖主机全局单例 store | 主客耦合强，版本与构建顺序敏感 |
| 事件总线 / postMessage 同步 | 类型弱、边界模糊、调试链路长 |
| Context 层层传递 | 构建边界跨越时 Context 断裂 |

### 解决方案：store 当 props 传导

主机持有 store，通过普通 props 传入子/远程组件。子组件仅依赖类型 `EmpStore<State>`，不关心 store 由谁创建。

```tsx
// ─── 共享类型定义（可放入共享包，供主客双方引用） ───
import { type EmpStore } from '@empjs/valtio'

const initialState = { count: 10, name: 'parent', loading: false }
type State = typeof initialState
export type Store = EmpStore<State>

// ─── 主机侧 ───
import { useStore } from '@empjs/valtio'

function Host() {
  const [snap, store] = useStore<State>(initialState)
  return <RemoteChild store={store} />   // store 作为普通 prop 传入
}

// ─── 远程/子应用组件（独立构建，仅依赖 Store 类型） ───
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

### 微前端场景下的状态层次

```
主机
├── 全局 store（createStore）→ 主题、用户会话 → 通过 props 传入子应用
└── 子应用 A
    ├── 接收主机下发的 store（props）→ 读写共享状态
    └── 自身局部 store（useStore）→ 子应用内部表单/编辑器等
```

**关键优势：**
- 子应用无需感知主机运行时，仅依赖共享的类型定义
- 适合 Module Federation 下独立部署与按需加载
- 局部与共享状态泾渭分明，无全局单例污染

---

## 6. 常见错误避雷

| 错误 | 现象 | 正确做法 |
|------|------|----------|
| 渲染时读 `store.xxx` 而非 `snap.xxx` | 状态更新后组件不重渲染 | 始终读 `useSnapshot()` 的返回值 |
| 传非 proxy 对象给 `useSnapshot`/`subscribe` | 控制台报 "Please use proxy object" | 确保传入的是 `createStore`/`useStore` 返回的 store |
| 键名使用 `set` | 与 `store.set(key, value)` 方法冲突，行为异常 | 换用其他键名，如 `tagSet` |
| 在 `derive` 中写副作用 | 派生状态行为不可预测 | `derive` 回调仅返回纯对象，不执行 IO/修改外部状态 |

```tsx
// ❌ 键名冲突示例
const store = createStore({
  set: createSet(),     // BAD：与 store.set() 方法同名
})

// ✅ 正确命名
const store = createStore({
  tagSet: createSet(),  // OK
})

// ❌ derive 写副作用
derive: (get, p) => {
  console.log('side effect!')          // BAD
  return { sum: get(p).a + get(p).b }
}

// ✅ derive 纯计算
derive: (get, p) => ({
  sum: get(p).a + get(p).b             // OK：仅返回纯对象
})
```

---

## 7. 场景矩阵：快速选型

| 场景 | 推荐方案 | 核心理由 |
|------|----------|----------|
| 全局配置（主题、语言、用户） | `createStore` | 单例共享，组件随时读取 |
| 表单/编辑器（多实例） | `useStore` | 每实例独立，卸载自动释放 |
| 需要撤销/重做 | `createStore` + `history` option | 历史栈内建，无需外接插件 |
| 需要派生/计算属性 | `createStore` + `derive` option | 自动响应依赖变化 |
| 需要本地持久化 | 任意 store + `.persist(key)` | 一行启用 |
| 微前端：主机 → 子应用共享状态 | 主机 `useStore`，props 传入子组件 | 无耦合，类型安全 |
| 微前端：子应用内部状态 | 子应用自行 `useStore` | 与主机完全隔离 |
| 批量更新避免多次渲染 | `store.batch(() => { ... })` | 多次写入仅触发一次更新 |

---

> **参考资料：** 官方文档 [valtio.empjs.dev](https://valtio.empjs.dev/) · API 详解 [valtio.empjs.dev/manual](https://valtio.empjs.dev/manual)