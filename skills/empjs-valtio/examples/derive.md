# 带派生的 createStore / useStore

## 带派生的 createStore

返回 `{ base, derived }`；base 写、derived 只读。

```tsx
import { createStore } from '@empjs/valtio'

const derivedStore = createStore(
  { a: 1, b: 2 },
  { derive: (get, base) => ({ sum: get(base).a + get(base).b }) }
)

function DerivedDemo() {
  const baseSnap = derivedStore.base.useSnapshot()
  const derivedSnap = derivedStore.derived.useSnapshot()
  return (
    <div>
      <p>base: a={baseSnap.a}, b={baseSnap.b}</p>
      <p>derived.sum: {derivedSnap.sum}</p>
      <button onClick={() => derivedStore.base.update({ a: baseSnap.a + 1 })}>a+1</button>
    </div>
  )
}
```

## 带派生的 useStore

返回 `[baseSnap, baseStore, derivedSnap]`。

```tsx
import { useStore } from '@empjs/valtio'

function DerivedDemoLocal() {
  const [baseSnap, baseStore, derivedSnap] = useStore(
    () => ({ a: 1, b: 2 }),
    { derive: (get, base) => ({ sum: get(base).a + get(base).b }) }
  )
  return (
    <div>
      <p>base: a={baseSnap.a}, b={baseSnap.b}</p>
      <p>derived.sum: {derivedSnap.sum}</p>
      <button onClick={() => baseStore.update({ a: baseSnap.a + 1 })}>a+1</button>
    </div>
  )
}
```
