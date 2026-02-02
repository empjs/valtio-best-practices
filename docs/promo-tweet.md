# 从 Vue 转 React？试试 @empjs/valtio——让你像写 Vue 响应式一样写 React 状态

> **如果你正在经历：** Zustand 替代了 Redux 的繁琐，但还是觉得不够"直觉"？从 Vue 转 React 后，怀念 `data.count++` 这种自然的写法？**@empjs/valtio** 可能是你的答案。它让 React 状态管理回归"改变数据就自动更新"的本能，同时把常用功能（撤销/重做、计算属性、本地存储）从 **4~5 个安装步骤简化为 1 行配置**。

---

## 📖 目录

1. [三分钟理解：Redux → Zustand → Valtio 的演变](#1-三分钟理解)
2. [核心体验：一个计数器的三种写法](#2-核心体验)
3. [为什么需要增强版？原版 Valtio 的"最后一公里"](#3-为什么需要增强版)
4. [实战对比：同一个功能，代码量差多少？](#4-实战对比)
5. [读写铁律：snap 和 store 不能混用](#5-读写铁律)
6. [内建武器库：17 个方法全解析](#6-内建武器库)
7. [全局 vs 局部：什么时候用哪个？](#7-全局-vs-局部)
8. [微前端场景：像传普通 props 一样传 store](#8-微前端场景)
9. [避坑指南：5 个新手常犯错误](#9-避坑指南)
10. [快速决策表：30 秒选对方案](#10-快速决策表)

---

## 1. 三分钟理解

### React 状态管理的三代演变

想象你在管理一家奶茶店的库存：

**Redux（第一代）—— 严格的仓库管理制度**
```javascript
// 每次改库存都要填表、盖章、走流程
dispatch({ type: 'UPDATE_MILK_TEA', payload: { count: 10 } })
// 优点：流程清晰，适合大团队协作
// 缺点：改个数字要写三个文件（action、reducer、connect）
```

**Zustand（第二代）—— 简化的库存本子**
```javascript
// 把表格简化成一个记账本
const useStore = create(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 }))
}))
// 优点：只要一个文件，API 很少
// 缺点：还是要定义"动作函数"，不能直接改数字
```

**Valtio（第三代）—— 像改普通变量一样**
```javascript
// 就像在白板上直接擦掉旧数字写新数字
const state = proxy({ count: 0 })
state.count++  // 就这么简单！UI 自动更新
// 优点：最接近 Vue 的 reactive，零学习成本
// 缺点：太"自由"了，缺少统一管理
```

### 为什么 Vue 开发者会爱上它？

如果你熟悉 Vue 3 的 `reactive`，那么 Valtio 的 `proxy` 几乎是同一个概念：

```vue
<!-- Vue 3 -->
<script setup>
const state = reactive({ count: 0 })
state.count++  // 直接改，视图自动更新
</script>
```

```tsx
// Valtio (React)
const state = proxy({ count: 0 })
state.count++  // 同样直接改，组件自动重渲染
```

两者底层都用了 JavaScript 的 `Proxy` 机制来追踪变化，这就是为什么 Valtio 常被称为"React 世界的 Vue 响应式"。

---

## 2. 核心体验

### 同一个计数器，三种库的写法

**Redux Toolkit（约 20 行）**
```tsx
// store.ts
import { createSlice } from '@reduxjs/toolkit'
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment: state => { state.count += 1 } }
})

// 组件
import { useSelector, useDispatch } from 'react-redux'
function Counter() {
  const count = useSelector(state => state.counter.count)
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(increment())}>
    {count}
  </button>
}
```

**Zustand（约 12 行）**
```tsx
import { create } from 'zustand'
const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}))

function Counter() {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}
```

**@empjs/valtio（约 7 行）**
```tsx
import { createStore } from '@empjs/valtio'
const store = createStore({ count: 0 })

function Counter() {
  const snap = store.useSnapshot()
  return <button onClick={() => store.set('count', snap.count + 1)}>
    {snap.count}
  </button>
}
```

### 量化对比

| 指标 | Redux Toolkit | Zustand | @empjs/valtio |
|------|:-------------:|:-------:|:-------------:|
| **代码行数** | ~20 行 | ~12 行 | **~7 行** |
| **需要定义"动作"** | 是（reducer） | 是（函数） | **否** |
| **TypeScript 类型推断** | 需手写 RootState | 需手写泛型 | **自动推导** |
| **添加撤销/重做** | 装 redux-undo | 自己实现 | **1 行配置** |

---

## 3. 为什么需要增强版？

### 原版 Valtio 的优势与边界

原版 Valtio 只有两个核心 API：
- `proxy(data)` — 创建响应式对象
- `useSnapshot(state)` — 在组件里读取数据

这种极简主义是优点也是局限：

**优点：** 学习成本几乎为零，写起来最自然  
**局限：** 生产环境需要的"工程化能力"都要自己加

### 原版缺失的"最后一公里"

| 缺失的能力 | 原版方案 | @empjs/valtio 方案 |
|-----------|---------|-------------------|
| **统一写入口** | 自己封装 `set`/`update` 函数 | `createStore` 内建 17 个方法 |
| **撤销/重做** | 装 `valtio-history` 并手动接入 | `createStore({ history })` 一行开启 |
| **计算属性** | 装 `derive-valtio` 并配置 | `createStore({ derive })` 自动计算 |
| **本地存储** | 自己写 `localStorage` 逻辑 | `store.persist('key')` 一行搞定 |
| **多实例隔离** | `useRef(proxy(...))` + 手动清理 | `useStore(init)` 自动管理生命周期 |

### 典型痛点场景

**场景 1：想加个"撤销"功能**
```tsx
// 原版：需要安装新包 + 多处改造
npm install valtio-history
import { proxyWithHistory } from 'valtio-history'
const state = proxyWithHistory({ count: 0 })
// 然后在组件里手动调 state.value.count、state.undo()

// 增强版：配置一下就行
const store = createStore({ count: 0 }, { history: true })
snap.undo()  // 直接用
```

**场景 2：表单需要"全名"自动拼接**
```tsx
// 原版：需要装 derive-valtio + 单独维护派生逻辑
npm install derive-valtio
import { derive } from 'derive-valtio'
const derived = derive({ fullName: get => ... })

// 增强版：写在配置里
const store = createStore(
  { firstName: '', lastName: '' },
  {
    derive: (get, p) => ({
      fullName: `${get(p).firstName} ${get(p).lastName}`.trim()
    })
  }
)
```

---

## 4. 实战对比

### 案例：用户信息表单（带撤销、计算属性、持久化）

**原版 Valtio（约 35 行）**
```tsx
// ① 安装依赖
// npm install valtio valtio-history derive-valtio

// ② 创建状态
import { proxy } from 'valtio'
import { proxyWithHistory } from 'valtio-history'
const state = proxyWithHistory({ firstName: '', lastName: '' })

// ③ 手写派生逻辑
import { derive } from 'derive-valtio'
const derived = derive({
  fullName: get => 
    `${get(state.value).firstName} ${get(state.value).lastName}`.trim()
})

// ④ 手写持久化
import { useEffect } from 'react'
useEffect(() => {
  const saved = localStorage.getItem('user')
  if (saved) Object.assign(state.value, JSON.parse(saved))
  const unsub = subscribe(state, () => 
    localStorage.setItem('user', JSON.stringify(state.value))
  )
  return unsub
}, [])

// ⑤ 组件使用
function Form() {
  const snap = useSnapshot(state)
  const derivedSnap = useSnapshot(derived)
  return (
    <>
      <input value={snap.value.firstName} 
             onChange={e => state.value.firstName = e.target.value} />
      <p>全名：{derivedSnap.fullName}</p>
      <button onClick={() => snap.undo()}>撤销</button>
    </>
  )
}
```

**@empjs/valtio（约 18 行）**
```tsx
// ① 一次性配置
import { createStore } from '@empjs/valtio'

const store = createStore(
  { firstName: '', lastName: '' },
  {
    history: { limit: 50 },  // 撤销功能
    derive: (get, p) => ({    // 计算属性
      fullName: `${get(p).firstName} ${get(p).lastName}`.trim()
    })
  }
)
store.persist('user-form')   // 持久化

// ② 直接用
function Form() {
  const snap = store.useSnapshot()
  const derived = store.derived.useSnapshot()
  return (
    <>
      <input value={snap.value.firstName}
             onChange={e => store.value.firstName = e.target.value} />
      <p>全名：{derived.fullName}</p>
      <button onClick={() => snap.undo()}>撤销</button>
    </>
  )
}
```

### 代码量对比

| 维度 | 原版 | 增强版 | 减少 |
|------|:----:|:------:|:----:|
| **总行数** | ~35 行 | ~18 行 | **48%** |
| **需要安装的包** | 3 个 | 1 个 | **66%** |
| **接入步骤** | 5 步 | 1 步 | **80%** |

---

## 5. 读写铁律

> **记住一句话：读用 snap，写用 store。** 这不是代码风格，是响应式系统的硬性要求。

### 为什么有这个规则？

Valtio 的响应式依赖 React 的 `useSnapshot` 来收集"谁用了哪些字段"。直接读 `store.xxx` 不会触发这个收集机制，组件就不会在数据变化时重新渲染。

```tsx
// ❌ 错误：读 store 不会触发重渲染
function Bad() {
  store.useSnapshot()  // 虽然调了 hook，但没用返回值
  return <span>{store.count}</span>  // 读的是 proxy，不是 snap
  // 结果：count 变了，页面不更新
}

// ✅ 正确：读 snap，写 store
function Good() {
  const snap = store.useSnapshot()
  return (
    <>
      <span>{snap.count}</span>  {/* 读 snap */}
      <button onClick={() => store.set('count', snap.count + 1)}>  {/* 写 store */}
        +1
      </button>
    </>
  )
}
```

### 带历史功能时的规则

如果开启了 `history` 配置，状态会被包在 `.value` 里：

| 操作 | 写法 |
|------|------|
| **读当前值** | `snap.value.firstName` |
| **写入新值** | `store.value.firstName = 'Alice'` |
| **撤销** | `snap.undo()` |
| **重做** | `snap.redo()` |

### 用类型保证不犯错

```tsx
import { type EmpStore } from '@empjs/valtio'

const initialState = { count: 0, name: '' }
type State = typeof initialState

// 子组件只依赖这个类型，TypeScript 会强制你用 store 的方法
export type Store = EmpStore<State>

function ChildComponent({ store }: { store: Store }) {
  const snap = store.useSnapshot()
  // snap.count = 1  // ❌ TypeScript 报错：snap 是只读的
  store.set('count', 1)  // ✅ 必须通过 store 的方法
}
```

---

## 6. 内建武器库

`createStore` / `useStore` 返回的对象有 **17 个方法**，分四大类：

### 📖 读取类（3 个）

| 方法 | 用途 | 示例 |
|------|------|------|
| `useSnapshot()` | 组件内读取数据（Hook） | `const snap = store.useSnapshot()` |
| `getSnapshot()` | 非组件场景读取（如回调） | `console.log(store.getSnapshot())` |
| `toJSON()` | 序列化为纯对象 | `const data = store.toJSON()` |

### ✏️ 写入类（6 个）

| 方法 | 用途 | 示例 |
|------|------|------|
| `set(key, value)` | 改单个字段 | `store.set('count', 10)` |
| `update(partial)` | 批量改多个字段 | `store.update({ count: 10, name: 'Alice' })` |
| `setNested(path, value)` | 改深层路径 | `store.setNested('user.address.city', '北京')` |
| `delete(key)` | 删除某个字段 | `store.delete('tempData')` |
| `reset(state?)` | 重置为初始状态 | `store.reset()` |
| `fromJSON(json)` | 从对象恢复状态 | `store.fromJSON(savedData)` |

### 👂 订阅类（3 个）

| 方法 | 用途 | 示例 |
|------|------|------|
| `subscribe(fn)` | 监听所有变化 | `store.subscribe(() => console.log('变了'))` |
| `subscribeKey(key, fn)` | 只监听某个字段 | `store.subscribeKey('count', val => ...)` |
| `subscribeKeys(keys, fn)` | 监听多个字段 | `store.subscribeKeys(['a', 'b'], ...)` |

### 🔧 工具类（5 个）

| 方法 | 用途 | 示例 |
|------|------|------|
| `ref(value)` | 标记为非响应式（如 DOM） | `store.set('dom', store.ref(divElement))` |
| `batch(fn)` | 批量更新，只触发一次渲染 | `store.batch(() => { ... })` |
| `clone()` | 深拷贝当前状态 | `const copy = store.clone()` |
| `persist(key)` | 开启 localStorage 持久化 | `store.persist('my-data')` |
| `debug()` | 在控制台打印每次变更 | `store.debug()` |

---

## 7. 全局 vs 局部

### 什么时候用 `createStore`（全局单例）？

**特征：** 数据需要跨组件共享，整个应用生命周期内只有一份

**典型场景：**
- 当前登录用户信息
- 主题配置（深色/浅色模式）
- 全局加载状态
- 购物车数据

```tsx
// 在单独文件里创建
import { createStore } from '@empjs/valtio'

export const themeStore = createStore({
  mode: 'light',
  primaryColor: '#1890ff'
})

// 任何组件都可以用
function Header() {
  const snap = themeStore.useSnapshot()
  return <div style={{ background: snap.primaryColor }}>...</div>
}
```

### 什么时候用 `useStore`（每实例独立）？

**特征：** 每个组件实例需要自己的独立状态，互不干扰

**典型场景：**
- 表单（页面上可能有多个表单）
- 代码编辑器（每个 Tab 一个编辑器）
- 画板工具（多画布场景）
- 计数器组件（同页面多个实例）

```tsx
import { useStore } from '@empjs/valtio'

function FormBlock({ initialLabel }: { initialLabel: string }) {
  // 每个 <FormBlock> 实例都有自己的 store
  const [snap, store] = useStore({ count: 0, label: initialLabel })
  
  return (
    <div>
      <p>{snap.label}: {snap.count}</p>
      <button onClick={() => store.set('count', snap.count + 1)}>
        +1
      </button>
      <button onClick={() => store.reset()}>重置</button>
    </div>
  )
}

// 两个实例，状态完全隔离
<FormBlock initialLabel="表单 A" />
<FormBlock initialLabel="表单 B" />
```

### 惰性初始化（适合昂贵计算）

```tsx
// 传函数而不是对象，只有第一次渲染时才执行
const [snap, store] = useStore(() => ({
  data: expensiveComputation(),  // 只在组件挂载时算一次
  timestamp: Date.now()
}))
```

---

## 8. 微前端场景

### 传统方案的问题

| 方案 | 问题 |
|------|------|
| **全局单例** | 子应用和主应用版本不一致就炸，构建顺序有依赖 |
| **事件总线** | 类型弱，调试困难，边界不清晰 |
| **postMessage** | 只能传序列化数据，丢失类型和方法 |

### @empjs/valtio 的方案：当普通 prop 传

**核心思想：** store 本身就是一个普通对象，可以像任何 React props 一样传递

```tsx
// ===== 共享类型定义（放在独立的 npm 包里） =====
import { type EmpStore } from '@empjs/valtio'

export const initialState = { count: 0, name: 'shared', loading: false }
export type State = typeof initialState
export type SharedStore = EmpStore<State>

// ===== 主应用（主机） =====
import { useStore } from '@empjs/valtio'
import { initialState, type SharedStore } from '@my-company/shared-types'
import RemoteChild from 'remote-app/Child'  // Module Federation

function Host() {
  const [snap, store] = useStore<State>(initialState)
  
  return (
    <div>
      <h1>主应用</h1>
      <p>主应用的计数：{snap.count}</p>
      
      {/* 像普通 prop 一样传给子应用 */}
      <RemoteChild store={store} />
    </div>
  )
}

// ===== 子应用（独立构建，独立部署） =====
import { type SharedStore } from '@my-company/shared-types'

function RemoteChild({ store }: { store: SharedStore }) {
  const snap = store.useSnapshot()
  
  return (
    <div>
      <h2>子应用</h2>
      <p>看到的主应用数据：{snap.count}</p>
      <button onClick={() => store.set('count', snap.count + 1)}>
        子应用也能改
      </button>
    </div>
  )
}
```

### 为什么这样好？

| 优势 | 说明 |
|------|------|
| **零耦合** | 子应用不需要知道主应用的运行时，只依赖类型定义 |
| **类型安全** | TypeScript 全程保护，改了类型定义，双方都能感知 |
| **调试简单** | 就是普通的 props，React DevTools 直接能看 |
| **版本独立** | 主应用升级不影响子应用，子应用可以独立发版 |

### 状态层次示意图

```
主应用
├── 全局 store（createStore）
│   ├── 用户信息
│   └── 主题配置
│       └── 通过 props 传给子应用 ──┐
│                                   ↓
└── 子应用 A                     接收 store
    ├── 使用主应用的 store（共享状态）
    └── 自己的 store（useStore）
        ├── 表单数据（局部）
        └── 编辑器状态（局部）
```

---

## 9. 避坑指南

### ❌ 错误 1：读 store 而不是 snap

```tsx
// 错误
function Bad() {
  store.useSnapshot()  // 虽然调了，但没用返回值
  return <span>{store.count}</span>  // 不会触发重渲染
}

// 正确
function Good() {
  const snap = store.useSnapshot()
  return <span>{snap.count}</span>
}
```

**为什么错：** Valtio 的响应式机制依赖 `useSnapshot` 的返回值来追踪"谁读了哪些字段"，直接读 `store` 不会被追踪。

### ❌ 错误 2：键名和方法重名

```tsx
// 错误：键名叫 set，和 store.set() 冲突
const store = createStore({
  set: new Set(),  // ❌ 冲突！
  update: 123      // ❌ 也冲突！
})

// 正确：换个名字
const store = createStore({
  tagSet: new Set(),  // ✅
  version: 123        // ✅
})
```

**为什么错：** `store.set` / `store.update` 是内建方法，用同名键会被覆盖。

### ❌ 错误 3：传非 proxy 对象给 useSnapshot

```tsx
// 错误
const plainObj = { count: 0 }
const snap = useSnapshot(plainObj)  // ❌ 报错

// 正确
const store = createStore({ count: 0 })
const snap = store.useSnapshot()  // ✅
```

**报错信息：** "Please use proxy object"

### ❌ 错误 4：在 derive 里写副作用

```tsx
// 错误
const store = createStore(
  { a: 1, b: 2 },
  {
    derive: (get, p) => {
      console.log('计算中')  // ❌ 副作用
      fetch('/api')          // ❌ 异步请求
      return { sum: get(p).a + get(p).b }
    }
  }
)

// 正确
const store = createStore(
  { a: 1, b: 2 },
  {
    derive: (get, p) => ({
      sum: get(p).a + get(p).b  // ✅ 纯计算
    })
  }
)
```

**为什么错：** `derive` 会被频繁调用（每次依赖变化都调），副作用会重复执行且难以控制。

### ❌ 错误 5：忘记 .value（开启历史功能时）

```tsx
// 开启历史后，状态被包在 .value 里
const store = createStore({ count: 0 }, { history: true })

// 错误
const snap = store.useSnapshot()
console.log(snap.count)  // ❌ undefined

// 正确
const snap = store.useSnapshot()
console.log(snap.value.count)  // ✅
store.value.count++             // ✅ 写入也要加 .value
```

---

## 10. 快速决策表

| 你的场景 | 推荐方案 | 示例代码 |
|---------|---------|---------|
| **全局配置（主题/语言/用户）** | `createStore` | `const themeStore = createStore({ mode: 'light' })` |
| **多个独立表单** | `useStore` | `const [snap, store] = useStore({ name: '' })` |
| **需要撤销/重做** | `createStore` + `history` | `createStore(init, { history: { limit: 50 } })` |
| **需要计算属性（如全名）** | `createStore` + `derive` | `createStore(init, { derive: (get, p) => ({ ... }) })` |
| **需要本地持久化** | 任意 store + `.persist()` | `store.persist('my-data-key')` |
| **微前端：主应用 → 子应用** | 主应用 `useStore`，props 传入 | `<RemoteChild store={store} />` |
| **微前端：子应用内部** | 子应用自行 `useStore` | 与主应用完全隔离 |
| **批量更新避免多次渲染** | `store.batch()` | `store.batch(() => { store.set(...); store.set(...) })` |
| **表单多次改值卡顿** | `store.batch()` | 输入框 onChange 里包一层 batch |

---

## 总结：三句话记住 @empjs/valtio

1. **像 Vue 一样写 React 状态** —— `state.count++` 就能自动更新 UI
2. **从 4~5 步简化到 1 步** —— 历史、计算属性、持久化都是一行配置
3. **微前端友好** —— store 当普通 props 传，无需全局单例和事件总线

---

**参考资料：**
- 📚 官方文档：[valtio.empjs.dev](https://valtio.empjs.dev/)
- 🔧 API 手册：[valtio.empjs.dev/manual](https://valtio.empjs.dev/manual)
- 🐙 GitHub：[@empjs/valtio](https://github.com/efoxTeam/emp/tree/main/packages/valtio)