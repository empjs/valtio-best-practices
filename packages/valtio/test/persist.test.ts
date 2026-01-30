import { afterEach, describe, expect, test } from 'bun:test'
import { createStore } from '../src/index'

const storageKey = 'valtio-test-persist'

afterEach(() => {
  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.removeItem(storageKey)
  }
})

describe('persist', () => {
  test('toJSON 可序列化', () => {
    const store = createStore({ count: 0, name: '' })
    const json = store.toJSON()
    expect(json).toEqual({ count: 0, name: '' })
  })

  test('persist 写入 localStorage 并恢复', async () => {
    if (typeof globalThis.localStorage === 'undefined') {
      test.skip()
      return
    }
    globalThis.localStorage.removeItem(storageKey)
    const store = createStore({ count: 5, name: 'saved' })
    const unsub = store.persist(storageKey)
    store.set('count', 10)
    store.set('name', 'updated')
    await new Promise(r => setTimeout(r, 50))
    const saved = globalThis.localStorage.getItem(storageKey)
    expect(saved).toBeTruthy()
    expect(JSON.parse(saved!)).toEqual({ count: 10, name: 'updated' })

    const store2 = createStore({ count: 0, name: '' })
    store2.persist(storageKey)
    expect(store2.toJSON().count).toBe(10)
    expect(store2.toJSON().name).toBe('updated')

    unsub()
    globalThis.localStorage.removeItem(storageKey)
  })

  test('fromJSON 合并后 getSnapshot 正确', () => {
    const store = createStore({ count: 0, name: '' })
    store.fromJSON({ count: 7, name: 'restored' })
    expect(store.toJSON()).toEqual({ count: 7, name: 'restored' })
  })
})
