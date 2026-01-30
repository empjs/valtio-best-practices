/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('update / set / setNested / delete', () => {
  test('update 批量更新', () => {
    const store = ValtioStore.create({a: 1, b: 2})
    store.update({a: 10, b: 20})
    expect(store.getSnapshot()).toMatchObject({a: 10, b: 20})
  })

  test('set 单字段', () => {
    const store = ValtioStore.create({k: 0})
    store.set('k', 1)
    expect((store.getSnapshot() as {k: number}).k).toBe(1)
  })

  test('setNested 按路径设置', () => {
    const store = ValtioStore.create({nest: {a: {b: 0}}})
    store.setNested('nest.a.b', 1)
    expect((store.getSnapshot() as {nest: {a: {b: number}}}).nest.a.b).toBe(1)
  })

  test('setNested 单层路径', () => {
    const store = ValtioStore.create({top: 0})
    store.setNested('top', 1)
    expect((store.getSnapshot() as {top: number}).top).toBe(1)
  })

  test('delete 删除 key', () => {
    const store = ValtioStore.create({a: 1, b: 2})
    store.delete('a')
    expect(store.getSnapshot()).not.toHaveProperty('a')
    expect((store.getSnapshot() as {b: number}).b).toBe(2)
  })
})
