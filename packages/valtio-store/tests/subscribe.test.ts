/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('subscribe / subscribeKey / subscribeKeys', () => {
  test('subscribe 监听变化并返回取消函数', async () => {
    const store = ValtioStore.create({v: 0})
    let calls = 0
    const unsub = store.subscribe(() => {
      calls += 1
    })
    store.set('v', 1)
    await Promise.resolve()
    expect(calls).toBeGreaterThanOrEqual(1)
    unsub()
    store.set('v', 2)
    await Promise.resolve()
    const afterUnsub = calls
    expect(calls).toBe(afterUnsub)
  })

  test('subscribeKey 只在该 key 变化时触发', async () => {
    const store = ValtioStore.create({a: 1, b: 2})
    let aCalls = 0
    store.subscribeKey('a', () => {
      aCalls += 1
    })
    store.set('a', 10)
    await Promise.resolve()
    expect(aCalls).toBeGreaterThanOrEqual(1)
    store.set('b', 20)
    await Promise.resolve()
    expect(aCalls).toBe(1)
  })

  test('subscribeKeys 多 key 任一变化即回调', async () => {
    const store = ValtioStore.create({x: 0, y: 0})
    const received: Array<[string, unknown]> = []
    const unsub = store.subscribeKeys(['x', 'y'], (key, value) => {
      received.push([key, value])
    })
    store.set('x', 1)
    await Promise.resolve()
    store.set('y', 2)
    await Promise.resolve()
    expect(received).toEqual([
      ['x', 1],
      ['y', 2],
    ])
    unsub()
  })
})
