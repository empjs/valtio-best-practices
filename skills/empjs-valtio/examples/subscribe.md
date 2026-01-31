# 订阅：subscribeKey / subscribeKeys、细粒度、batch

## subscribeKey / subscribeKeys + UI 联动

在 `useEffect` 中订阅，将变更写入 state（如日志），组件卸载时取消订阅。

```tsx
import { useStore } from '@empjs/valtio'
import { useEffect, useState } from 'react'

function SubscribeDemo() {
  const [snap, store] = useStore(() => ({ count: 0, name: 'x' }))
  const [keyLog, setKeyLog] = useState('')
  const [keysLog, setKeysLog] = useState('')

  useEffect(() => {
    const unsub = store.subscribeKey('count', value => {
      setKeyLog(prev => prev + `count=${value}\n`)
    })
    return unsub
  }, [store])

  useEffect(() => {
    const unsub = store.subscribeKeys(['count', 'name'], (key, value) => {
      setKeysLog(prev => prev + `${key}=${value}\n`)
    })
    return unsub
  }, [store])

  return (
    <div>
      <pre>{keyLog || '—'}</pre>
      <pre>{keysLog || '—'}</pre>
      <button onClick={() => store.set('count', snap.count + 1)}>count+1</button>
      <button onClick={() => store.set('name', snap.name === 'x' ? 'y' : 'x')}>name 切换</button>
      <button
        onClick={() =>
          store.batch(s => {
            s.count = 0
            s.name = 'reset'
          })
        }
      >
        batch reset
      </button>
    </div>
  )
}
```

## 细粒度订阅（只读部分字段）

`useSnapshot(store)` 只会订阅实际读取的路径。只读 `snap.count` 的组件在 `name` 变化时不会重渲染；只读 `snap.name` 的组件在 `count` 变化时不会重渲染。

```tsx
import { useStore } from '@empjs/valtio'
import { useRef } from 'react'

type StoreWithCountName = { useSnapshot(): { count: number; name: string } }

function OnlyCount({ store, renderLabel }: { store: StoreWithCountName; renderLabel: string }) {
  const snap = store.useSnapshot()
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div>
      <span>count: {snap.count}</span>
      <span> {renderLabel}{renderCount.current}</span>
    </div>
  )
}

function OnlyName({ store, renderLabel }: { store: StoreWithCountName; renderLabel: string }) {
  const snap = store.useSnapshot()
  const renderCount = useRef(0)
  renderCount.current += 1
  return (
    <div>
      <span>name: {snap.name}</span>
      <span> {renderLabel}{renderCount.current}</span>
    </div>
  )
}

function FineGrainedDemo() {
  const [snap, store] = useStore(() => ({ count: 0, name: 'x' }))
  return (
    <div>
      <OnlyCount store={store} renderLabel="渲染 #" />
      <OnlyName store={store} renderLabel="渲染 #" />
      <button onClick={() => store.set('count', snap.count + 1)}>count+1</button>
      <button onClick={() => store.set('name', snap.name === 'x' ? 'y' : 'x')}>name 切换</button>
    </div>
  )
}
```

## batch 合并多次写

`store.batch(fn)` 内多次写合并为一次订阅通知，减少重渲染。

```tsx
import { useStore } from '@empjs/valtio'

function BatchUpdate() {
  const [snap, store] = useStore(() => ({ count: 0, name: '' }))
  const handleReset = () => {
    store.batch(s => {
      s.count = 0
      s.name = 'reset'
    })
  }
  return (
    <div>
      <p>{snap.count} / {snap.name}</p>
      <button onClick={handleReset}>reset</button>
    </div>
  )
}
```
