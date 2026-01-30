import { CounterStore } from './counterStore'

/** 全局 Counter 单例，供 GlobalCounter 组件共享 */
export const globalCounterStore = CounterStore.createGlobal({
  count: 0,
  name: 'Global Store',
})
