# @empjs/valtio 按使用方法说明

按「用法」组织：常规 store、带历史、带派生、集合、持久化、订阅与 batch。每节包含用法要点与简短示例。

---

## 1. 常规 Store

**createStore**：模块级单例，跨组件共享。读用 `store.useSnapshot()`，写用 `store.set` / `store.update`。

```ts
import { createStore } from '@empjs/valtio'

const store = createStore({ count: 0, name: '' }, { name: 'AppStore' })

// 组件内
const snap = store.useSnapshot()
store.set('count', snap.count + 1)
store.update({ name: 'Alice' })
```

**useStore**：组件内每实例独立。返回 `[snap, store]`，读用 `snap`，写用 `store`。

```ts
import { useStore } from '@empjs/valtio'

const [snap, store] = useStore({ count: 0 })
// 或惰性初始化
const [snap, store] = useStore(() => ({ count: 0 }))
store.set('count', snap.count + 1)
```

---

## 2. 带历史的 Store

**createStore / useStore** 传入 `{ history: {} }`。读用 `snap.value.xxx`，写用 `store.value.xxx = y`；撤销/重做用 `snap.undo()` / `snap.redo()`；当前记录步数 `snap.history?.nodes?.length`。

```ts
// 全局
const store = createStore({ count: 0 }, { history: {} })
const snap = store.useSnapshot()
// snap.value.count, snap.isUndoEnabled, snap.isRedoEnabled, snap.undo(), snap.redo()

// 局部
const [snap, store] = useStore(() => ({ count: 0 }), { history: {} })
store.value.count = snap.value.count + 1
snap.undo()
const steps = snap.history?.nodes?.length ?? 0
```

---

## 3. 带派生的 Store

**createStore** 传入 `{ derive: (get, proxy) => ({ ... }) }`，返回 `{ base, derived }`。base 写、derived 只读。

```ts
const { base, derived } = createStore(
  { a: 1, b: 2 },
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }
)
const baseSnap = base.useSnapshot()
const derivedSnap = derived.useSnapshot() // { sum }
base.update({ a: 10 })
```

**useStore** 带 derive 返回 `[baseSnap, baseStore, derivedSnap]`。

```ts
const [baseSnap, baseStore, derivedSnap] = useStore(
  () => ({ a: 1, b: 2 }),
  { derive: (get, p) => ({ sum: get(p).a + get(p).b }) }
)
baseStore.update({ a: baseSnap.a + 1 })
```

---

## 4. 集合 createMap / createSet

**全局**：在 createStore 初始状态里放 `createMap` / `createSet`，组件内 `store.useSnapshot()` 读、`store.map` / `store.tagSet` 写。

```ts
import { createMap, createSet, createStore } from '@empjs/valtio'

const collectionsStore = createStore(
  {
    map: createMap<string, number>([['a', 1], ['b', 2]]),
    tagSet: createSet<string>(['x']),
  },
  { name: 'CollectionsStore' }
)

// 组件内
const snap = collectionsStore.useSnapshot()
const entries = Array.from(snap.map.entries())
collectionsStore.map.set('c', 3)
collectionsStore.tagSet.add('y')
collectionsStore.map.delete('a')
collectionsStore.tagSet.clear()
```

**局部**：在 useStore 初始状态里放 map/set，读 `snap.map` / `snap.tagSet`，写 `store.map` / `store.tagSet`。注意勿用 key 名 `"set"`（与 `store.set` 冲突）。

---

## 5. 持久化

`store.persist('key')` 与 localStorage 双向同步（toJSON/fromJSON），返回 `Unsubscribe`。

```ts
const store = createStore({ theme: 'light' })
store.persist('app-settings')
```

---

## 6. 订阅与 batch

- **subscribe(cb, notifyInSync?)**：全量变更订阅。
- **subscribeKey(key, cb)**：单 key 变更回调。
- **subscribeKeys(keys, cb)**：多 key，`cb(key, value)`。
- **batch(fn)**：fn 内多次写合并为一次通知。

```ts
store.subscribeKey('count', (value) => console.log('count', value))
store.subscribeKeys(['count', 'name'], (key, value) => console.log(key, value))

store.batch((s) => {
  s.count = 1
  s.name = 'x'
})
// 只触发一次订阅
```

---

更多类型与签名见 [api.md](api.md)，完整示例见 [examples/index.md](../examples/index.md)。
