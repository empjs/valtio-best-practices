# 常规 createStore / useStore

## 常规 createStore（全局）

```tsx
import { createStore } from '@empjs/valtio'

const demoStore = createStore({ count: 0 }, { name: 'DemoStore' })

function Counter() {
  const snap = demoStore.useSnapshot()
  return (
    <div>
      <p>count: {snap.count}</p>
      <button onClick={() => demoStore.set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
```

## 常规 useStore（局部）

```tsx
import { useStore } from '@empjs/valtio'

function LocalCounter() {
  const [snap, store] = useStore({ count: 0 })
  return (
    <div>
      <p>count: {snap.count}</p>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
    </div>
  )
}
```
