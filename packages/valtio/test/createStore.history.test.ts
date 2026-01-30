import { describe, expect, test } from 'bun:test'
import { createStore, snapshot } from '../src/index'

describe('createStore history', () => {
  test('options.history 返回带 value/undo/redo 的 store', () => {
    const store = createStore({ count: 0 }, { history: { limit: 10 } })
    const snap = snapshot(store) as { value: { count: number }; isUndoEnabled: boolean; isRedoEnabled: boolean }
    expect(snap.value).toEqual({ count: 0 })
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
  })

  test('写 value 后 snapshot 更新', () => {
    const store = createStore({ count: 0 }, { history: { limit: 10 } })
    store.value.count = 1
    const snap = snapshot(store) as { value: { count: number } }
    expect(snap.value.count).toBe(1)
  })

  test('undo 可调用且不抛错', () => {
    const store = createStore({ count: 0 }, { history: { limit: 10 } })
    store.value.count = 1
    store.value.count = 2
    expect(store.value.count).toBe(2)
    expect(() => store.undo()).not.toThrow()
    expect(() => store.undo()).not.toThrow()
  })

  test('redo 前进', () => {
    const store = createStore({ count: 0 }, { history: { limit: 10 } })
    store.value.count = 1
    store.undo()
    store.redo()
    const snap = snapshot(store) as { value: { count: number } }
    expect(snap.value.count).toBe(1)
  })

  test('redo 可调用且不抛错', () => {
    const store = createStore({ count: 0 }, { history: { limit: 10 } })
    store.value.count = 1
    store.undo()
    expect(() => store.redo()).not.toThrow()
  })

  test('limit 生效：历史节点数不超过 limit+1', async () => {
    const store = createStore({ count: 0 }, { history: { limit: 2 } })
    store.value.count = 1
    store.value.count = 2
    store.value.count = 3
    store.value.count = 4
    await new Promise(r => setTimeout(r, 20))
    expect(store.history.nodes.length).toBeLessThanOrEqual(3)
    expect(store.value.count).toBe(4)
    store.undo()
    expect(store.value.count).not.toBe(4)
    store.undo()
    expect(store.history.nodes.length).toBeLessThanOrEqual(3)
  })
})
