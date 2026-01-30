/**
 * performance 完整示例：长列表 + batch 批量操作 + content-visibility
 * 调用闭环：useStore 存 items → 批量增删用 batch 合并写、只触发一次通知 → 列表用 snap.items 渲染 → 每行 content-visibility: auto 或虚拟列表减少重排
 */
export const performanceSnippet = `// ========== 1. 长列表 + batch 批量操作（调用闭环）==========
import { useStore } from '@empjs/valtio'

type Item = { id: number; text: string; done: boolean }

const [snap, store] = useStore(() => ({
  items: [] as Item[],
}))

// 批量添加：用 batch 合并多次写，只触发一次订阅通知，避免每 push 一次就重渲染
function addMany(n: number) {
  store.batch((s) => {
    const start = s.items.length
    for (let i = 0; i < n; i++) {
      s.items.push({ id: start + i, text: \`Item \${start + i}\`, done: false })
    }
  })
}

// 批量删除：batch 内 splice，一次通知
function removeFirst(n: number) {
  store.batch((s) => { s.items.splice(0, n) })
}

// 全选/取消：batch 内遍历更新，一次通知
function toggleAll(done: boolean) {
  store.batch((s) => { s.items.forEach((item) => { item.done = done }) })
}

// ========== 2. 长列表渲染：content-visibility 与虚拟列表 ==========
// 闭环建议：1) 用 batch 做批量增删改  2) 列表容器固定高度 + overflow-auto  3) 每行 content-visibility: auto 或使用 virtua 等虚拟列表
function List() {
  const snap = store.useSnapshot()
  return (
    <div className="max-h-96 overflow-auto">
      {snap.items.map((item) => (
        <div
          key={item.id}
          className="border-b border-slate-200 px-2 py-1 flex items-center gap-2"
          style={{ contentVisibility: 'auto' }}
        >
          <input type="checkbox" checked={item.done} onChange={...} />
          <span className="tabular-nums text-slate-700">{item.id}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}
`
