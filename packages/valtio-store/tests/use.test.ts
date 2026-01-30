/// <reference lib="dom" />
import {renderHook} from '@testing-library/react'
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('ValtioStore.use', () => {
  test('use() 无参时用 getInitialState', () => {
    const {result} = renderHook(() => ValtioStore.use())
    const [snap] = result.current
    expect(snap && typeof snap === 'object' && !Array.isArray(snap)).toBe(true)
    expect(Object.keys(snap as object).filter(k => typeof (snap as Record<string, unknown>)[k] !== 'function')).toEqual([])
  })

  test('use(initialState) 使用传入状态', () => {
    const {result} = renderHook(() => ValtioStore.use({count: 1}))
    expect((result.current[0] as {count: number}).count).toBe(1)
  })

  test('use(() => state) 惰性初始化', () => {
    const {result} = renderHook(() => ValtioStore.use(() => ({lazy: true})))
    expect((result.current[0] as {lazy: boolean}).lazy).toBe(true)
  })

  test('use(globalStore) 直接使用传入 store', () => {
    const globalStore = ValtioStore.createGlobal({shared: 1})
    globalStore.set('shared', 2)
    const {result} = renderHook(() => ValtioStore.use(globalStore))
    expect((result.current[0] as {shared: number}).shared).toBe(2)
  })

  test('use 返回 [snap, store]，store 可写', async () => {
    const {result, rerender} = renderHook(() => ValtioStore.use({n: 0}))
    const [, store] = result.current
    store.set('n', 5)
    rerender()
    expect((result.current[0] as {n: number}).n).toBe(5)
  })
})
