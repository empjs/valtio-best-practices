import {describe, expect, test} from '@rstest/core'
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
    const {result} = renderHook(() => useStore({count: 0}, {history: {}}))
    const [snap, store] = result.current
    expect((snap as {value: {count: number}}).value).toEqual({count: 0})
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
  })

  test('undo/redo 可调用', () => {
    const {result} = renderHook(() => useStore({count: 0}, {history: {}}))
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

  test('history snapshot 在撤销后启用重做，并在重做后关闭', async () => {
    const nextTick = () => new Promise<void>(resolve => setTimeout(resolve, 0))
    const {result} = renderHook(() => {
      const [snap, store] = useStore({count: 0}, {history: {}})
      return {
        count: snap.value.count,
        isUndoEnabled: snap.isUndoEnabled,
        isRedoEnabled: snap.isRedoEnabled,
        store,
      }
    })

    await act(async () => {
      result.current.store.value.count = 1
      await nextTick()
    })
    await act(async () => {
      result.current.store.value.count = 2
      await nextTick()
    })
    expect(result.current.count).toBe(2)
    expect(result.current.isUndoEnabled).toBe(true)
    expect(result.current.isRedoEnabled).toBe(false)

    await act(async () => {
      result.current.store.undo()
      await nextTick()
    })
    expect(result.current.count).toBe(1)
    expect(result.current.isUndoEnabled).toBe(true)
    expect(result.current.isRedoEnabled).toBe(true)

    await act(async () => {
      result.current.store.redo()
      await nextTick()
    })
    expect(result.current.count).toBe(2)
    expect(result.current.isUndoEnabled).toBe(true)
    expect(result.current.isRedoEnabled).toBe(false)
  })
})

describe('useStore derive', () => {
  test('options.derive 返回响应式的 [baseSnap, baseStore, derivedSnap]', async () => {
    const {result} = renderHook(() => useStore({a: 1, b: 2}, {derive: (get, p) => ({sum: get(p).a + get(p).b})}))
    const [baseSnap, baseStore] = result.current
    expect(baseSnap.a).toBe(1)
    expect(baseSnap.b).toBe(2)
    expect(result.current.length).toBe(3)
    expect(result.current[2].sum).toBe(3)
    await act(async () => {
      baseStore.update({a: 10})
    })
    expect(baseStore.toJSON().a).toBe(10)
    expect(result.current[2].sum).toBe(12)
  })
})
