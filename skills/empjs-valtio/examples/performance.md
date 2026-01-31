# 长列表 + batch + content-visibility

长列表用 `store.batch` 做批量增删/全选，列表容器用 `contain: layout style`，每行用 `contentVisibility: 'auto'` 优化渲染。

```tsx
import { useStore } from '@empjs/valtio'

function genItems(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    text: `Item ${start + i}`,
    done: false,
  }))
}

function LongListDemo() {
  const [snap, store] = useStore(() => ({ items: genItems(0, 500) }))

  const addMany = (n: number) => {
    store.batch(s => {
      const start = s.items.length
      for (let i = 0; i < n; i++) {
        s.items.push({ id: start + i, text: `Item ${start + i}`, done: false })
      }
    })
  }

  const removeFirst = (n: number) => {
    store.batch(s => s.items.splice(0, n))
  }

  const toggleAll = (done: boolean) => {
    store.batch(s => s.items.forEach(item => { item.done = done }))
  }

  const toggleOne = (id: number) => {
    const item = store.items.find(i => i.id === id)
    if (item) item.done = !item.done
  }

  const allDone = snap.items.length > 0 && snap.items.every(item => item.done)

  return (
    <div>
      <p>共 {snap.items.length} 条</p>
      <button onClick={() => addMany(100)}>添加 100 条</button>
      <button onClick={() => removeFirst(100)} disabled={snap.items.length === 0}>
        删除前 100 条
      </button>
      <button onClick={() => toggleAll(!allDone)} disabled={snap.items.length === 0}>
        {allDone ? '取消全选' : '全选'}
      </button>
      <div style={{ contain: 'layout style', maxHeight: 320, overflow: 'auto' }}>
        {snap.items.map(item => (
          <div
            key={item.id}
            style={{ contentVisibility: 'auto' }}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleOne(item.id)}
            />
            <span>{item.id}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```
