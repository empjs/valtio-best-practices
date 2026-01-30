import { describe, expect, test } from 'bun:test'
import { createStore } from '../src/index'

describe('createStore 常规', () => {
  test('无 options 返回增强 store', () => {
    const store = createStore({ count: 0 })
    expect(store.toJSON()).toEqual({ count: 0 })
    expect(typeof store.set).toBe('function')
    expect(typeof store.update).toBe('function')
    expect(typeof store.subscribe).toBe('function')
  })

  test('options.name / devtools 不抛错', () => {
    const store = createStore(
      { count: 0 },
      { name: 'TestStore', devtools: false },
    )
    expect(store.toJSON()).toEqual({ count: 0 })
  })
})
