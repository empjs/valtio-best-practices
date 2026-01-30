# @empjs/valtio

Valtio 的增强版状态库 —— 更少样板代码，更高生产力。基于 [Valtio](https://github.com/pmndrs/valtio) 的细粒度响应式机制，提供开箱即用的高级功能：历史回溯、自动派生、持久化、嵌套更新、克隆、重置等。

## 安装

```bash
pnpm add @empjs/valtio
# npm install @empjs/valtio
# yarn add @empjs/valtio
# bun add @empjs/valtio
```

**依赖**：React 18+（作为 peerDependency）。

## 快速上手

### 全局 Store：createStore

```tsx
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

无需手动 `proxy` + `useSnapshot`，store 自带 `set`、`update`、`reset`、`persist` 等方法。

### 局部 Store：useStore

适合表单、编辑器等组件内状态，每个组件实例拥有独立 store：

```tsx
import { useStore } from '@empjs/valtio'

function Form() {
  const [snap, store] = useStore({ name: '', age: 0 })
  return (
    <form>
      <input value={snap.name} onChange={e => store.set('name', e.target.value)} />
      <input type="number" value={snap.age} onChange={e => store.set('age', Number(e.target.value))} />
    </form>
  )
}
```

### 历史记录（撤销/重做）

- **不做限制**：传 `{ history: {} }` 或不传 `limit`，历史节点不裁剪，可撤销步数无上限。
- **做限制**：传 `{ history: { limit: 50 } }` 表示最多保留 50 步可撤销；超出后由本库自动丢弃最旧节点（valtio-history 原生不支持 limit）。

**全局：**

```tsx
// 不限制步数
const store = createStore({ text: '' }, { history: {} })

// 或限制最多 50 步
const store = createStore({ text: '' }, { history: { limit: 50 } })
// store.useSnapshot() 返回 { value, history, undo, redo, isUndoEnabled, isRedoEnabled }
```

**局部：**

```tsx
// 不限制步数
const [snap, store] = useStore(initialState, { history: {} })

// 或限制最多 50 步
const [snap, store] = useStore(initialState, { history: { limit: 50 } })
// snap 上直接有 undo、redo、isUndoEnabled、isRedoEnabled
```

### 派生状态（derive）

**全局：**

```tsx
const { base, derived } = createStore(
  { firstName: '', lastName: '' },
  {
    derive: (get, proxy) => ({
      fullName: `${get(proxy).firstName} ${get(proxy).lastName}`.trim(),
    }),
  }
)
// base.useSnapshot() → 原始状态；derived.useSnapshot() → { fullName }
```

**局部：**

```tsx
const [baseSnap, baseStore, derivedSnap] = useStore(
  { a: 1, b: 2 },
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }
)
// derivedSnap.sum 自动更新
```

### 持久化

```tsx
const store = createStore({ theme: 'light' })
store.persist('app-settings') // 自动与 localStorage 双向同步，返回取消订阅函数
```

### 集合：createMap / createSet

```tsx
import { createMap, createSet } from '@empjs/valtio'

const map = createMap<string, number>([['a', 1]])
const set = createSet<number>([1, 2, 3])
// 可放入 createStore 初始状态或 useStore，响应式更新
```

## API 概览

| 能力 | 说明 |
|------|------|
| `createStore(initialState, options?)` | 创建全局增强 store；options 支持 `devtools`、`name`、`history`、`derive` |
| `useStore(initialState, options?)` | 组件内局部 store；options 支持 `history`、`derive` |
| `createMap` / `createSet` | 可代理的 Map/Set |
| Store 方法 | `getSnapshot`、`useSnapshot`、`subscribe`、`subscribeKey`、`subscribeKeys`、`update`、`set`、`setNested`、`delete`、`reset`、`ref`、`batch`、`clone`、`toJSON`、`fromJSON`、`persist`、`debug` |

同时从本库可再导出 Valtio 原生：`proxy`、`snapshot`、`subscribe`、`subscribeKey`、`ref`、`useSnapshot`、`proxyWithHistory`、`proxyMap`、`proxySet`、`derive`、`devtools`。

## 文档与示例

- **在线文档与 Demo**：运行本仓库根目录 `pnpm dev`，访问 `apps/valtio-offical` 提供的文档站。
- **对比与设计**：见仓库根目录 `docs/improvements.md`、`docs/compare.md`。

## 测试与覆盖率

```bash
bun test          # 运行测试
bun test --coverage   # 运行测试并生成覆盖率（或 pnpm tc）
```

测试用例位于 `test/` 目录，按功能分文件：`enhanceStore.test.ts`、`createStore.test.ts`、`createStore.history.test.ts`、`createStore.derive.test.ts`、`collections.test.ts`、`subscribe.test.ts`、`persist.test.ts`、`useStore.test.tsx`。

## License

MIT
