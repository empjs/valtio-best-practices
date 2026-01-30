/// <reference lib="dom" />
import {afterEach, beforeEach, describe, expect, mock, test} from 'bun:test'
import ValtioStore from '../src/index'

const storageKey = 'valtio-store-test-persist'

describe('persist', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  })

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  })

  test('无已存数据时订阅写入', async () => {
    const store = ValtioStore.create({x: 1})
    const unsub = store.persist(storageKey)
    store.set('x', 2)
    await Promise.resolve()
    const saved = localStorage.getItem(storageKey)
    expect(saved).toBe(JSON.stringify({x: 2}))
    unsub()
  })

  test('有已存数据时 fromJSON 恢复', () => {
    localStorage.setItem(storageKey, JSON.stringify({x: 99}))
    const store = ValtioStore.create({x: 0})
    store.persist(storageKey)
    expect((store.getSnapshot() as {x: number}).x).toBe(99)
  })

  test('localStorage 非法 JSON 时 catch 并 console.error', () => {
    const origError = console.error
    const consoleSpy = mock(() => {})
    console.error = consoleSpy as typeof console.error
    localStorage.setItem(storageKey, 'invalid json')
    const store = ValtioStore.create({})
    store.persist(storageKey)
    expect(consoleSpy).toHaveBeenCalled()
    console.error = origError
  })
})
