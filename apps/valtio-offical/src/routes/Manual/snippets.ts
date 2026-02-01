import type {Locale} from 'src/i18n/translations'

/** createStore / useStore 两节放在 17 个方法前 */
export const MANUAL_ENTRY_IDS = ['createStore', 'useStore'] as const

export const MANUAL_METHOD_IDS = [
  'useSnapshot',
  'set',
  'update',
  'reset',
  'subscribe',
  'subscribeKey',
  'subscribeKeys',
  'batch',
  'getSnapshot',
  'persist',
  'clone',
  'toJSON',
  'fromJSON',
  'setNested',
  'delete',
  'ref',
  'debug',
] as const

export type ManualMethodId = (typeof MANUAL_METHOD_IDS)[number]

const snippetsZh: Record<ManualMethodId, string> = {
  useSnapshot: `const snap = store.useSnapshot()
// 结果: snap 为只读快照，如 { count: 0, name: '' }
return <span>{snap.count}</span>`,
  set: `store.set('count', 1)
// 结果: store 的 count 变为 1，订阅者会更新`,
  update: `store.update({ count: 1, name: 'x' })
// 结果: 批量更新，一次通知`,
  reset: `store.reset({ count: 0, name: '' })
// 结果: 数据恢复为初始状态，方法保留`,
  subscribe: `const unsub = store.subscribe(() => console.log('changed'))
// 结果: 返回取消函数 unsub()`,
  subscribeKey: `store.subscribeKey('count', (v) => console.log('count=', v))
// 结果: 仅 count 变化时触发`,
  subscribeKeys: `store.subscribeKeys(['count', 'name'], (k, v) => console.log(k, v))
// 结果: count 或 name 变化时触发`,
  batch: `store.batch((s) => {
  s.count = 1
  s.name = 'x'
})
// 结果: 只触发一次订阅`,
  getSnapshot: `const snap = store.getSnapshot()
// 结果: 当前只读快照，非 React 用`,
  persist: `store.persist('my-key')
// 结果: 与 localStorage 双向同步，返回 unsub`,
  clone: `const store2 = store.clone()
// 结果: 新 EmpStore，数据深拷贝`,
  toJSON: `const json = store.toJSON()
// 结果: { count: 0, name: '' }，无 function/symbol`,
  fromJSON: `store.fromJSON({ count: 10, name: 'y' })
// 结果: store 数据被覆盖写入`,
  setNested: `store.setNested('a.b.c', 1)
// 结果: 深层路径写入`,
  delete: `store.delete('name')
// 结果: 删除 name 字段`,
  ref: `store.ref(someObject)
// 结果: 存非代理引用，变化不触发订阅`,
  debug: `store.debug('MyStore')
// 结果: console 打印当前快照`,
}

const snippetsEn: Record<ManualMethodId, string> = {
  useSnapshot: `const snap = store.useSnapshot()
// result: snap is read-only snapshot, e.g. { count: 0, name: '' }
return <span>{snap.count}</span>`,
  set: `store.set('count', 1)
// result: store.count becomes 1, subscribers update`,
  update: `store.update({ count: 1, name: 'x' })
// result: batch update, one notification`,
  reset: `store.reset({ count: 0, name: '' })
// result: data reset to initial state, methods kept`,
  subscribe: `const unsub = store.subscribe(() => console.log('changed'))
// result: returns unsubscribe function unsub()`,
  subscribeKey: `store.subscribeKey('count', (v) => console.log('count=', v))
// result: only triggers when count changes`,
  subscribeKeys: `store.subscribeKeys(['count', 'name'], (k, v) => console.log(k, v))
// result: triggers when count or name changes`,
  batch: `store.batch((s) => {
  s.count = 1
  s.name = 'x'
})
// result: single subscription trigger`,
  getSnapshot: `const snap = store.getSnapshot()
// result: current read-only snapshot, for non-React`,
  persist: `store.persist('my-key')
// result: bidirectional sync with localStorage, returns unsub`,
  clone: `const store2 = store.clone()
// result: new EmpStore, deep-copied data`,
  toJSON: `const json = store.toJSON()
// result: { count: 0, name: '' }, no function/symbol`,
  fromJSON: `store.fromJSON({ count: 10, name: 'y' })
// result: store data overwritten`,
  setNested: `store.setNested('a.b.c', 1)
// result: deep path write`,
  delete: `store.delete('name')
// result: remove name field`,
  ref: `store.ref(someObject)
// result: store non-proxy ref, changes do not trigger subscription`,
  debug: `store.debug('MyStore')
// result: console logs current snapshot`,
}

export function getManualMethodSnippet(method: ManualMethodId, locale: Locale): string {
  return locale === 'zh' ? snippetsZh[method] : snippetsEn[method]
}

const createStoreSnippet = {
  zh: `import { createStore } from '@empjs/valtio'

const store = createStore({ count: 0, name: '' })
// 结果: store 为 EmpStore<{ count: number; name: string }>，跨组件共享
const snap = store.useSnapshot()
store.set('count', 1)`,
  en: `import { createStore } from '@empjs/valtio'

const store = createStore({ count: 0, name: '' })
// result: store is EmpStore<{ count: number; name: string }>, shared across components
const snap = store.useSnapshot()
store.set('count', 1)`,
}

const useStoreConductionSnippet = {
  zh: `import { type EmpStore, useStore } from '@empjs/valtio'

type State = { count: number; name: string }

// 子组件：接收 EmpStore，读 snap、写 set/reset（传导）
function Child({ store }: { store: EmpStore<State> }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
      <button onClick={() => store.reset({ count: 0, name: '' })}>Reset</button>
    </div>
  )
}

// 父组件：useStore 得到 [snap, store]，将 store 传导给子组件
function Parent() {
  const [snap, store] = useStore<State>({ count: 10, name: 'parent' })
  return <Child store={store} />
}`,
  en: `import { type EmpStore, useStore } from '@empjs/valtio'

type State = { count: number; name: string }

// Child: receives EmpStore, read snap, write set/reset (conduction)
function Child({ store }: { store: EmpStore<State> }) {
  const snap = store.useSnapshot()
  return (
    <div>
      <span>{snap.count}</span>
      <button onClick={() => store.set('count', snap.count + 1)}>+1</button>
      <button onClick={() => store.reset({ count: 0, name: '' })}>Reset</button>
    </div>
  )
}

// Parent: useStore returns [snap, store], pass store to child (conduction)
function Parent() {
  const [snap, store] = useStore<State>({ count: 10, name: 'parent' })
  return <Child store={store} />
}`,
}

export function getCreateStoreSnippet(locale: Locale): string {
  return locale === 'zh' ? createStoreSnippet.zh : createStoreSnippet.en
}

export function getUseStoreSnippet(locale: Locale): string {
  return locale === 'zh' ? useStoreConductionSnippet.zh : useStoreConductionSnippet.en
}
