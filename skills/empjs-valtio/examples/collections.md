# 集合 createMap / createSet

使用 `useMemo` 将 `snap.map` / `snap.tagSet` 转为数组，避免每次快照引用变化导致多余重算。勿用 key 名 `"set"`（与 `store.set` 冲突）。

## 全局 createStore + Map/Set

```tsx
import { createMap, createSet, createStore } from '@empjs/valtio'
import { useMemo } from 'react'

const collectionsStore = createStore(
  {
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
    tagSet: createSet<string>(['x']),
  },
  { name: 'CollectionsStore' }
)

function GlobalCollectionsDemo() {
  const snap = collectionsStore.useSnapshot()
  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])
  return (
    <div>
      <p>Map ({snap.map.size}): {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}</p>
      <p>Set ({snap.tagSet.size}): {setValues.join(', ') || '—'}</p>
      <button onClick={() => collectionsStore.map.set('c', (snap.map.get('c') ?? 0) + 1)}>
        map.set('c', n+1)
      </button>
      <button onClick={() => collectionsStore.tagSet.add('y')}>tagSet.add('y')</button>
      <button onClick={() => snap.map.has('a') && collectionsStore.map.delete('a')}>
        map.delete('a')
      </button>
      <button onClick={() => collectionsStore.tagSet.delete('x')}>tagSet.delete('x')</button>
    </div>
  )
}
```

## 局部 useStore + Map/Set

```tsx
import { createMap, createSet, useStore } from '@empjs/valtio'
import { useMemo } from 'react'

function LocalCollectionsDemo() {
  const [snap, store] = useStore(() => ({
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
    tagSet: createSet<string>(['x']),
  }))
  const mapEntries = useMemo(() => Array.from(snap.map.entries()), [snap.map])
  const setValues = useMemo(() => Array.from(snap.tagSet), [snap.tagSet])
  return (
    <div>
      <p>Map ({snap.map.size}): {mapEntries.map(([k, v]) => `${k}=${v}`).join(', ') || '—'}</p>
      <p>Set ({snap.tagSet.size}): {setValues.join(', ') || '—'}</p>
      <button onClick={() => store.map.set('c', (snap.map.get('c') ?? 0) + 1)}>map.set('c', n+1)</button>
      <button onClick={() => store.tagSet.add('y')}>tagSet.add('y')</button>
      <button onClick={() => snap.map.has('a') && store.map.delete('a')}>map.delete('a')</button>
      <button onClick={() => store.tagSet.clear()}>tagSet.clear()</button>
    </div>
  )
}
```
