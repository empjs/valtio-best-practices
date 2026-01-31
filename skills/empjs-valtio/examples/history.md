# 带历史的 createStore / useStore

读 `snap.value.xxx`，写 `store.value.xxx`；撤销/重做用 `snap.undo()` / `snap.redo()`；当前记录步数 `snap.history?.nodes?.length`。

## 带历史的 createStore

```tsx
import { createStore } from '@empjs/valtio'

const historyStore = createStore({ count: 0 }, { history: {} })

function HistoryCounter() {
  const snap = historyStore.useSnapshot()
  const steps = snap.history?.nodes?.length ?? 0
  return (
    <div>
      <p>count: {snap.value.count}</p>
      <p>步数: {steps}</p>
      <button onClick={() => (historyStore.value.count = snap.value.count + 1)}>+1</button>
      <button onClick={() => historyStore.undo()} disabled={!snap.isUndoEnabled}>撤销</button>
      <button onClick={() => historyStore.redo()} disabled={!snap.isRedoEnabled}>重做</button>
    </div>
  )
}
```

## 带历史的 useStore

```tsx
import { useStore } from '@empjs/valtio'

function HistoryCounterLocal() {
  const [snap, store] = useStore(() => ({ count: 0 }), { history: {} })
  const steps = snap.history?.nodes?.length ?? 0
  return (
    <div>
      <p>count: {snap.value.count}</p>
      <p>步数: {steps}</p>
      <button onClick={() => (store.value.count = snap.value.count + 1)}>+1</button>
      <button onClick={() => store.undo()} disabled={!snap.isUndoEnabled}>撤销</button>
      <button onClick={() => store.redo()} disabled={!snap.isRedoEnabled}>重做</button>
    </div>
  )
}
```
