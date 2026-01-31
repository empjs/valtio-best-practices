# 异步 createStore / useStore

异步方法写在 store 内，`this` 指向 store；读 `snap.loading` / `snap.user` / `snap.error`，写通过调用 `store.loadUser()`。

## 异步 createStore（方法在 store 内）

```tsx
import { createStore } from '@empjs/valtio'

const asyncStore = createStore(
  {
    user: null as { name: string } | null,
    loading: false,
    error: null as Error | null,
    loadUser() {
      this.loading = true
      this.error = null
      setTimeout(() => {
        this.user = { name: 'Alice' }
        this.loading = false
      }, 500)
    },
  },
  { name: 'AsyncStore' }
)

function AsyncDemo() {
  const snap = asyncStore.useSnapshot()
  if (snap.loading) return <p>Loading…</p>
  if (snap.error) return <p role="alert">Error: {snap.error.message}</p>
  return (
    <div>
      <p>{snap.user ? `user: ${snap.user.name}` : '未加载'}</p>
      <button onClick={() => asyncStore.loadUser()}>
        {snap.user ? '重新加载' : '加载用户'}
      </button>
    </div>
  )
}
```

## 异步 useStore（局部）

```tsx
import { useStore } from '@empjs/valtio'

function AsyncDemoLocal() {
  const [snap, store] = useStore(() => ({
    user: null as { name: string } | null,
    loading: false,
    error: null as Error | null,
    loadUser() {
      this.loading = true
      this.error = null
      setTimeout(() => {
        this.user = { name: 'Bob' }
        this.loading = false
      }, 500)
    },
  }))
  if (snap.loading) return <p>Loading…</p>
  if (snap.error) return <p role="alert">Error: {snap.error.message}</p>
  return (
    <div>
      <p>{snap.user ? `user: ${snap.user.name}` : '未加载'}</p>
      <button onClick={() => store.loadUser()}>
        {snap.user ? '重新加载' : '加载用户'}
      </button>
    </div>
  )
}
```
