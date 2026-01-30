import {describe, expect, test} from 'bun:test'
import {createStore} from '../src/index'

describe('enhanceStore / createStore 基础方法', () => {
  test('getSnapshot 返回当前快照', () => {
    const store = createStore({count: 0, name: ''})
    expect(store.toJSON()).toEqual({count: 0, name: ''})
    store.set('count', 1)
    expect(store.toJSON()).toEqual({count: 1, name: ''})
  })

  test('set 单字段更新', () => {
    const store = createStore({count: 0, name: 'a'})
    store.set('count', 5)
    store.set('name', 'b')
    expect(store.toJSON()).toEqual({count: 5, name: 'b'})
  })

  test('update 批量更新', () => {
    const store = createStore({count: 0, name: ''})
    store.update({count: 2, name: 'x'})
    expect(store.toJSON()).toEqual({count: 2, name: 'x'})
  })

  test('delete 删除字段', () => {
    const store = createStore({a: 1, b: 2} as {a: number; b?: number})
    store.delete('b')
    expect(store.toJSON()).toEqual({a: 1})
  })

  test('reset 重置为初始状态', () => {
    const store = createStore({count: 10, name: 'old'})
    store.update({count: 99, name: 'x'})
    store.reset({count: 0, name: ''})
    expect(store.toJSON()).toEqual({count: 0, name: ''})
  })

  test('setNested 深层路径更新', () => {
    const store = createStore({foo: {bar: {num: 0}}})
    store.setNested('foo.bar.num', 42)
    expect(store.toJSON().foo?.bar?.num).toBe(42)
  })

  test('batch 批量写', () => {
    const store = createStore({a: 0, b: 0})
    store.batch(s => {
      s.a = 1
      s.b = 2
    })
    expect(store.toJSON()).toEqual({a: 1, b: 2})
  })

  test('toJSON 仅可序列化字段', () => {
    const store = createStore({
      count: 1,
      fn: () => {},
    } as {count: number; fn?: () => void})
    const json = store.toJSON()
    expect(json).toEqual({count: 1})
    expect('fn' in json).toBe(false)
  })

  test('fromJSON 合并 JSON', () => {
    const store = createStore({count: 0, name: ''})
    store.fromJSON({count: 10, name: 'restored'})
    expect(store.toJSON()).toEqual({count: 10, name: 'restored'})
  })

  test('clone 深拷贝得到新 store', () => {
    const store = createStore({a: 1, b: 2})
    const cloned = store.clone()
    expect(cloned.toJSON()).toEqual({a: 1, b: 2})
    store.set('a', 99)
    expect(store.toJSON().a).toBe(99)
    expect(cloned.toJSON().a).toBe(1)
  })

  test('ref 包装非代理值', () => {
    const store = createStore({count: 0})
    const raw = {id: 1}
    const wrapped = store.ref(raw)
    expect(wrapped).toBe(raw)
  })

  test('debug 不抛错', () => {
    const store = createStore({count: 0})
    expect(() => store.debug('Test')).not.toThrow()
  })
})
