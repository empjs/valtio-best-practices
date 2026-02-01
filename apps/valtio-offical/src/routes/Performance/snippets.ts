import type {Locale} from 'src/i18n/translations'

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

export const performanceSnippetEn = `// ========== 1. Long list + batch bulk ops (call flow) ==========
import { useStore } from '@empjs/valtio'

type Item = { id: number; text: string; done: boolean }

const [snap, store] = useStore(() => ({
  items: [] as Item[],
}))

// Bulk add: batch merges multiple writes, one notification, avoid re-render per push
function addMany(n: number) {
  store.batch((s) => {
    const start = s.items.length
    for (let i = 0; i < n; i++) {
      s.items.push({ id: start + i, text: \`Item \${start + i}\`, done: false })
    }
  })
}

// Bulk remove: splice inside batch, one notification
function removeFirst(n: number) {
  store.batch((s) => { s.items.splice(0, n) })
}

// Select all / deselect: batch loop update, one notification
function toggleAll(done: boolean) {
  store.batch((s) => { s.items.forEach((item) => { item.done = done }) })
}

// ========== 2. Long list render: content-visibility and virtual list ==========
// Flow tips: 1) Use batch for bulk add/remove/update  2) Fixed height + overflow-auto on list  3) contentVisibility: auto per row or virtua
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

export const performanceSnippet2 = `// ========== 2. 细粒度更新（子组件） ==========
import { useStore } from '@empjs/valtio'

const store = useStore(() => ({ title: 'Parent', count: 0 }))[1]

// 只订阅 count 的组件，title 变化不会导致此组件重渲染
function Child({ id }: { id: string }) {
  const snap = store.useSnapshot()
  return <div>{id}: {snap.count} (Render: {Math.random()})</div>
}
`

export const performanceSnippet3 = `// ========== 3. 瞬时更新（Ref） ==========
import { useRef, useEffect } from 'react'
import { subscribe } from '@empjs/valtio'

// 鼠标高频移动，不触发生命周期和 React commit，只更新 DOM
function MouseTracker() {
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // 订阅 store.pos 变化，直接操作 DOM
    return subscribe(store.pos, () => {
       if (divRef.current) divRef.current.innerText = \`\${store.pos.x}, \${store.pos.y}\`
    })
  }, [])
  return <div ref={divRef} />
}
`

export const performanceSnippet4 = `// ========== 4. 派生计算缓存 (derive) ==========
import { derive } from '@empjs/valtio'

// 只有 filters 或 items 变化时，filteredItems 才会重新计算
const derived = derive({
  filteredItems: (get) => {
    const items = get(store).items
    const filter = get(store).filter
    return items.filter(i => i.includes(filter))
  }
})
`

export const performanceSnippet2En = `// ========== 2. Fine-grained Update (Child) ==========
import { useStore } from '@empjs/valtio'

const store = useStore(() => ({ title: 'Parent', count: 0 }))[1]

// Child only subscribes to count; title change won't re-render it
function Child({ id }: { id: string }) {
  const snap = store.useSnapshot()
  return <div>{id}: {snap.count} (Render: {Math.random()})</div>
}
`

export const performanceSnippet3En = `// ========== 3. Transient Update (Ref) ==========
import { useRef, useEffect } from 'react'
import { subscribe } from '@empjs/valtio'

// High-freq mouse move, update DOM directly, no React re-render
function MouseTracker() {
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Subscribe to store.pos, update DOM
    return subscribe(store.pos, () => {
       if (divRef.current) divRef.current.innerText = \`\${store.pos.x}, \${store.pos.y}\`
    })
  }, [])
  return <div ref={divRef} />
}
`

export const performanceSnippet4En = `// ========== 4. Derived Memoization ==========
import { derive } from '@empjs/valtio'

// filteredItems re-computes only when items or filter changes
const derived = derive({
  filteredItems: (get) => {
    const items = get(store).items
    const filter = get(store).filter
    return items.filter(i => i.includes(filter))
  }
})
`

export function getPerformanceSnippet(locale: Locale) {
  if (locale === 'zh') {
    return [performanceSnippet, performanceSnippet2, performanceSnippet3, performanceSnippet4].join('\n')
  }
  return [performanceSnippetEn, performanceSnippet2En, performanceSnippet3En, performanceSnippet4En].join('\n')
}
