# Valtio Store 工具库 - 使用指南

## 概述

这是 Valtio 状态管理的函数式工具库，提供了简洁的 API 来创建和管理状态。

## 安装依赖

```bash
npm install valtio valtio-history derive-valtio
```

## 基础用法

### 1. 创建全局 Store

```typescript
import { createStore } from './valtio-store'

// 创建全局计数器
const counterStore = createStore(
  {
    count: 0,
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
  { devtools: true, name: 'Counter' }
)

// 在任何地方使用
counterStore.increment()
console.log(counterStore.count) // 1
```

### 2. 在 React 组件中使用局部 Store

```typescript
import { useStore } from './valtio-store'

function Counter() {
  const [snap, store] = useStore({
    count: 0,
    increment() {
      this.count++
    },
  })

  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={() => store.increment()}>+1</button>
    </div>
  )
}
```

### 3. 惰性初始化

```typescript
function ExpensiveComponent() {
  // 只在组件首次挂载时计算初始状态
  const [snap, store] = useStore(() => ({
    data: computeExpensiveData(),
    processedData: [],
  }))

  return <div>{snap.data.length} items</div>
}
```

## 高级功能

### 1. 带历史记录的 Store（撤销/重做）

```typescript
import { useStoreWithHistory } from './valtio-store'

function TextEditor() {
  const [snap, store] = useStoreWithHistory(
    { text: '' },
    { limit: 50 } // 最多保留 50 条历史
  )

  return (
    <div>
      <textarea
        value={snap.value.text}
        onChange={(e) => (store.value.text = e.target.value)}
      />
      <button onClick={() => store.undo()} disabled={!snap.isUndoEnabled}>
        撤销
      </button>
      <button onClick={() => store.redo()} disabled={!snap.isRedoEnabled}>
        重做
      </button>
    </div>
  )
}
```

### 2. 派生状态

```typescript
import { useStoreWithDerived } from './valtio-store'

function ShoppingCart() {
  const [baseSnap, baseStore, derivedSnap] = useStoreWithDerived(
    {
      items: [
        { name: 'Apple', price: 1.5, quantity: 2 },
        { name: 'Banana', price: 0.8, quantity: 3 },
      ],
    },
    (get) => {
      const state = get(baseStore)
      return {
        total: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
      }
    }
  )

  return (
    <div>
      <h3>购物车 ({derivedSnap.itemCount} 件商品)</h3>
      <ul>
        {baseSnap.items.map((item, i) => (
          <li key={i}>
            {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p>总计: ${derivedSnap.total.toFixed(2)}</p>
    </div>
  )
}
```

### 3. 异步 Store

```typescript
import { useAsyncStore } from './valtio-store'

function UserProfile({ userId }: { userId: string }) {
  const [snap, store] = useAsyncStore({
    user: null as User | null,
  })

  // 创建异步方法
  const fetchUser = store.async('fetchUser', async (id: string) => {
    const response = await fetch(`/api/users/${id}`)
    const user = await response.json()
    store.user = user
    return user
  })

  useEffect(() => {
    fetchUser(userId)
  }, [userId])

  if (snap._loading.fetchUser) return <div>加载中...</div>
  if (snap._error.fetchUser) return <div>错误: {snap._error.fetchUser.message}</div>
  if (!snap.user) return <div>未找到用户</div>

  return (
    <div>
      <h2>{snap.user.name}</h2>
      <p>{snap.user.email}</p>
    </div>
  )
}
```

## Store 方法参考

所有 store 都包含以下方法：

```typescript
// 订阅
store.subscribe(() => console.log('状态变化'))
store.subscribeKey('count', (value) => console.log('count 变为', value))
store.subscribeKeys(['count', 'name'], (key, value) => console.log(key, '变为', value))

// 更新
store.update({ count: 10, name: 'John' })
store.set('count', 5)
store.setNested('user.profile.age', 25)

// 删除
store.delete('tempData')

// 重置
store.reset({ count: 0 }) // 重置为指定状态

// 工具
store.ref(largeObject) // 标记为 ref，不深度代理
store.clone() // 深拷贝并创建新 store
store.toJSON() // 转为纯对象
store.fromJSON({ count: 20 }) // 从纯对象恢复

// 持久化
const unsubscribe = store.persist('my-store-key') // 自动保存到 localStorage
// 稍后取消
unsubscribe()

// 调试
store.debug('当前状态')
```

## 集合类型

```typescript
import { createMap, createSet } from './valtio-store'

// Map
const userMap = createMap<string, User>([
  ['user1', { name: 'Alice', age: 25 }],
  ['user2', { name: 'Bob', age: 30 }],
])

userMap.set('user3', { name: 'Charlie', age: 35 })
console.log(userMap.get('user1'))

// Set
const tagSet = createSet(['react', 'typescript', 'valtio'])
tagSet.add('node')
console.log(tagSet.has('react')) // true
```

## 从类版本迁移

### 之前（类方式）

```typescript
class TodoStore extends ValtioStore {
  todos: Todo[] = []

  addTodo(text: string) {
    this.todos.push({ id: Date.now(), text, done: false })
  }

  getInitialState() {
    return { todos: [] }
  }
}

// 全局
const todoStore = TodoStore.createGlobal()

// 局部
function App() {
  const [snap, store] = TodoStore.use()
  // ...
}
```

### 现在（函数方式）

```typescript
// 定义工厂函数
function createTodoStore(initialTodos: Todo[] = []) {
  return createStore({
    todos: initialTodos,
    
    addTodo(text: string) {
      this.todos.push({ id: Date.now(), text, done: false })
    },
  })
}

// 全局
const todoStore = createTodoStore()

// 局部
function App() {
  const [snap, store] = useStore(() => ({
    todos: [],
    addTodo(text: string) {
      this.todos.push({ id: Date.now(), text, done: false })
    },
  }))
  // ...
}
```

## 性能优化技巧

### 1. 使用 ref 避免深度代理

```typescript
const store = createStore({
  // 大对象不需要响应式
  largeDataset: ref(computeLargeData()),
  
  // 需要响应式的字段
  currentPage: 1,
})
```

### 2. 批量更新

```typescript
store.batch((s) => {
  s.count = 10
  s.name = 'New Name'
  s.items = []
})
// 或直接使用 update
store.update({ count: 10, name: 'New Name', items: [] })
```

### 3. 按需订阅

```typescript
// 只订阅特定字段
store.subscribeKey('count', (value) => {
  console.log('count changed:', value)
})

// 订阅多个字段
store.subscribeKeys(['count', 'name'], (key, value) => {
  console.log(`${key} changed:`, value)
})
```

## TypeScript 类型提示

```typescript
// 定义 store 类型
interface TodoStore {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo(text: string): void
  toggleTodo(id: number): void
}

// 使用时有完整类型提示
const [snap, store] = useStore<TodoStore>({
  todos: [],
  filter: 'all',
  addTodo(text) {
    this.todos.push({ id: Date.now(), text, done: false })
  },
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  },
})

// snap 和 store 都有完整的类型推断
snap.todos // Todo[]
store.addTodo('New todo') // 类型安全
```

## 最佳实践

1. **全局状态使用 createStore**：跨组件共享的状态
2. **局部状态使用 useStore**：组件私有状态
3. **复杂计算使用派生状态**：避免重复计算
4. **异步操作使用 createAsyncStore**：自动管理 loading/error
5. **大对象使用 ref**：避免不必要的代理
6. **持久化按需使用**：只持久化必要的数据

## 调试

开发环境会自动启用 Redux DevTools：

```typescript
const store = createStore(
  { count: 0 },
  { devtools: true, name: 'Counter Store' } // 自定义名称
)
```

控制台调试：

```typescript
store.debug('检查状态')
// 输出：
// ▼ 检查状态
//   count: 5
//   name: "John"
```