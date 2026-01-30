import {describe, expect, test} from 'bun:test'
import {act, renderHook} from '@testing-library/react'
import {useStore} from '../src/index'

describe('useStore 常规', () => {
  test('返回 [snap, store]，初始状态正确', () => {
    const {result} = renderHook(() => useStore({count: 0}))
    const [snap, store] = result.current
    expect(snap.count).toBe(0)
    expect(typeof store.set).toBe('function')
  })

  test('store 更新后 snap 变化', () => {
    const {result} = renderHook(() => useStore({count: 0}))
    act(() => {
      result.current[1].set('count', 3)
    })
    expect(result.current[1].getSnapshot().count).toBe(3)
  })

  test('惰性初始化', () => {
    const {result} = renderHook(() => useStore(() => ({count: 10})))
    expect(result.current[0].count).toBe(10)
  })
})

describe('useStore history', () => {
  test('options.history 返回 value/undo/redo', () => {
    const {result} = renderHook(() => useStore({count: 0}, {history: {limit: 10}}))
    const [snap, store] = result.current
    expect((snap as {value: {count: number}}).value).toEqual({count: 0})
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
  })

  test('undo/redo 可调用', () => {
    const {result} = renderHook(() => useStore({count: 0}, {history: {limit: 10}}))
    act(() => {
      result.current[1].value.count = 2
    })
    expect(result.current[1].value.count).toBe(2)
    act(() => {
      result.current[1].undo()
    })
    act(() => {
      result.current[1].redo()
    })
    expect(result.current[1].value.count).toBe(2)
  })
})

describe('useStore derive', () => {
  test('options.derive 返回 [baseSnap, baseStore, derivedSnap]', () => {
    const {result} = renderHook(() => useStore({a: 1, b: 2}, {derive: (get, p) => ({sum: get(p).a + get(p).b})}))
    const [baseSnap, baseStore] = result.current
    expect(baseSnap.a).toBe(1)
    expect(baseSnap.b).toBe(2)
    expect(result.current.length).toBe(3)
    act(() => {
      baseStore.update({a: 10})
    })
    expect(baseStore.toJSON().a).toBe(10)
  })
})
