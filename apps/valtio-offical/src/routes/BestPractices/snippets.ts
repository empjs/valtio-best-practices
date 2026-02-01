import type {Locale} from 'src/i18n/translations'

const snippets: Record<Locale, string> = {
  zh: `import { type EnhancedStore, createStore, useStore } from '@empjs/valtio'

// 1. 类型定义最佳姿势：使用 EnhancedStore<T>
// ------------------------------------------------------------------
type MyState = { count: number; name: string }

// 错误：手动定义 (繁琐且容易漏掉 set/reset 等方法)
// interface MyStore { useSnapshot(): MyState; ... }

// 正确：一步到位 (包含 useSnapshot, set, reset, batch, subscribe...)
type MyStore = EnhancedStore<MyState>


// 2. 只有全局 Store (Global)
// ------------------------------------------------------------------
const globalStore = createStore({ count: 0, name: 'global' }) // 自动推导为 EnhancedStore


// 3. 组件通信最佳姿势 (Parent -> Child)
// ------------------------------------------------------------------

// Child: 接收 EnhancedStore，既能读也能写
function ChildComponent({ store }: { store: EnhancedStore<MyState> }) {
  // 读：类型自动推导
  const snap = store.useSnapshot()

  return (
    <div>
      <p>Count: {snap.count}</p>
      
      {/* 写：直接调用 store 方法，类型安全 */}
      <button onClick={() => store.count++}>+1</button>
      <button onClick={() => store.set('name', 'child')}>Change Name</button>
      <button onClick={() => store.reset({ count: 0, name: 'reset' })}>Reset</button>
    </div>
  )
}

// Parent: 创建 store 并传递
function ParentComponent() {
  // 本地创建 store
  const [snap, store] = useStore({ count: 10, name: 'parent' })

  // 将 store 自身传给子组件
  return <ChildComponent store={store} />
}
`,
  en: `import { type EnhancedStore, createStore, useStore } from '@empjs/valtio'

// 1. Best Practice for Types: Use EnhancedStore<T>
// ------------------------------------------------------------------
type MyState = { count: number; name: string }

// BAD: Manual definition (Tedious, missing methods like set/reset)
// interface MyStore { useSnapshot(): MyState; ... }

// GOOD: All-in-one (Includes useSnapshot, set, reset, batch, subscribe...)
type MyStore = EnhancedStore<MyState>


// 2. Global Store
// ------------------------------------------------------------------
const globalStore = createStore({ count: 0, name: 'global' }) // Auto-inferred as EnhancedStore


// 3. Component Communication (Parent -> Child)
// ------------------------------------------------------------------

// Child: Receives EnhancedStore, can Read AND Write
function ChildComponent({ store }: { store: EnhancedStore<MyState> }) {
  // Read: Types inferred automatically
  const snap = store.useSnapshot()

  return (
    <div>
      <p>Count: {snap.count}</p>
      
      {/* Write: Call store methods directly, type-safe */}
      <button onClick={() => store.count++}>+1</button>
      <button onClick={() => store.set('name', 'child')}>Change Name</button>
      <button onClick={() => store.reset({ count: 0, name: 'reset' })}>Reset</button>
    </div>
  )
}

// Parent: Create store and pass it down
function ParentComponent() {
  // Create local store
  const [snap, store] = useStore({ count: 10, name: 'parent' })

  // Pass the store itself to child
  return <ChildComponent store={store} />
}
`,
}

export const getBestPracticesSnippet = (locale: Locale) => snippets[locale]
