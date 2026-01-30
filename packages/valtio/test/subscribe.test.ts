import {describe, expect, test} from 'bun:test'
import {createStore} from '../src/index'

describe('subscribe', () => {
  test('subscribe 回调在更新后触发（notifyInSync）', () => {
    const store = createStore({count: 0})
    let calls = 0
    const unsub = store.subscribe(() => {
      calls += 1
    }, true)
    store.set('count', 1)
    expect(calls).toBe(1)
    store.set('count', 2)
    expect(calls).toBe(2)
    unsub()
    store.set('count', 3)
    expect(calls).toBe(2)
  })
})

describe('subscribeKey', () => {
  test('仅该 key 变化时触发', async () => {
    const store = createStore({a: 0, b: 0})
    let aCalls = 0
    let bCalls = 0
    store.subscribeKey('a', () => {
      aCalls += 1
    })
    store.subscribeKey('b', () => {
      bCalls += 1
    })
    store.set('a', 1)
    store.set('b', 1)
    await new Promise(r => setTimeout(r, 20))
    expect(aCalls).toBeGreaterThanOrEqual(1)
    expect(bCalls).toBeGreaterThanOrEqual(1)
  })
})

describe('subscribeKeys', () => {
  test('多 key 任一变化触发 callback', async () => {
    const store = createStore({a: 0, b: 0, c: 0})
    const events: Array<{key: string; value: number}> = []
    store.subscribeKeys(['a', 'b'], (key, value) => {
      events.push({key, value: value as number})
    })
    store.set('a', 1)
    store.set('b', 2)
    store.set('c', 3)
    await new Promise(r => setTimeout(r, 20))
    expect(events).toContainEqual({key: 'a', value: 1})
    expect(events).toContainEqual({key: 'b', value: 2})
    expect(events.length).toBeGreaterThanOrEqual(2)
  })
})
