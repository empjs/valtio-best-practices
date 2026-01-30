/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('reset / ref / batch / clone', () => {
  test('reset 清空后写回 getInitialState（基类返回 {}）', () => {
    const store = ValtioStore.create({count: 5, name: 'x'})
    store.reset()
    expect(store.toJSON()).toEqual({})
  })

  test('ref 返回 ref 包装值', () => {
    const store = ValtioStore.create({})
    const big = {data: 'large'}
    const r = store.ref(big)
    expect(r).toBeDefined()
  })

  test('batch 执行函数', () => {
    const store = ValtioStore.create({a: 0, b: 0})
    store.batch(s => {
      s.update({a: 1, b: 1})
    })
    expect(store.toJSON()).toMatchObject({a: 1, b: 1})
  })

  test('clone 深拷贝并生成新 store', () => {
    const store = ValtioStore.create({a: 1, b: {c: 2}})
    const cloned = store.clone()
    expect(cloned).not.toBe(store)
    expect(cloned.toJSON()).toEqual({a: 1, b: {c: 2}})
    cloned.set('a', 99)
    expect(store.toJSON()).toMatchObject({a: 1})
  })
})
