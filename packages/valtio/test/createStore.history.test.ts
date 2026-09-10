import {describe, expect, test} from '@rstest/core'
import {createStore, snapshot} from '../src/index'

describe('createStore history', () => {
  test('options.history 返回带 value/undo/redo 的 store', () => {
    const store = createStore({count: 0}, {history: {}})
    const snap = snapshot(store) as {value: {count: number}; isUndoEnabled: boolean; isRedoEnabled: boolean}
    expect(snap.value).toEqual({count: 0})
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
  })

  test('写 value 后 snapshot 更新', () => {
    const store = createStore({count: 0}, {history: {}})
    store.value.count = 1
    const snap = snapshot(store) as {value: {count: number}}
    expect(snap.value.count).toBe(1)
  })

  test('undo 可调用且不抛错', () => {
    const store = createStore({count: 0}, {history: {}})
    store.value.count = 1
    store.value.count = 2
    expect(store.value.count).toBe(2)
    expect(() => store.undo()).not.toThrow()
    expect(() => store.undo()).not.toThrow()
  })

  test('undo 后启用 redo 并恢复值', async () => {
    const store = createStore({count: 0}, {history: {}})
    store.value.count = 2
    await new Promise(resolve => setTimeout(resolve, 0))
    store.undo()
    await new Promise(resolve => setTimeout(resolve, 0))

    const undoSnap = snapshot(store) as {value: {count: number}; isRedoEnabled: boolean}
    expect(undoSnap.value.count).toBe(0)
    expect(undoSnap.isRedoEnabled).toBe(true)

    store.redo()
    await new Promise(resolve => setTimeout(resolve, 0))

    const redoSnap = snapshot(store) as {value: {count: number}; isRedoEnabled: boolean}
    expect(redoSnap.value.count).toBe(2)
    expect(redoSnap.isRedoEnabled).toBe(false)
  })
})
