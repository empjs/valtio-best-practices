/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('getSnapshot / toJSON / fromJSON', () => {
  test('getSnapshot 返回只读快照（toJSON 仅含数据）', () => {
    const store = ValtioStore.create({a: 1, b: 2})
    expect(store.toJSON()).toEqual({a: 1, b: 2})
    expect(store.getSnapshot()).toBeDefined()
  })

  test('toJSON 排除 function 和 symbol', () => {
    const store = ValtioStore.create({num: 1, fn: () => {}})
    const json = store.toJSON()
    expect(json).toHaveProperty('num', 1)
    expect(json).not.toHaveProperty('fn')
  })

  test('fromJSON 写回 store', () => {
    const store = ValtioStore.create({a: 1})
    store.fromJSON({a: 2, b: 3})
    expect(store.getSnapshot()).toMatchObject({a: 2, b: 3})
  })

  test('bindProxyMethods 重写 toJSON：无 receiver 时仍对同一 proxy 调用', () => {
    const store = ValtioStore.create({x: 1})
    const json = store.toJSON()
    expect(json).toEqual({x: 1})
    expect(JSON.stringify(store)).toBe('{"x":1}')
  })
})
