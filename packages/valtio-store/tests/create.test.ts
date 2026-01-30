/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('ValtioStore.create', () => {
  test('无参创建得到空状态', () => {
    const store = ValtioStore.create()
    expect(store.toJSON()).toEqual({})
  })

  test('传入初始状态', () => {
    const store = ValtioStore.create({count: 1, name: 'a'})
    const snap = store.getSnapshot()
    expect((snap as {count: number}).count).toBe(1)
    expect((snap as {name: string}).name).toBe('a')
  })

  test('每次 create 返回新实例', () => {
    const a = ValtioStore.create({x: 1})
    const b = ValtioStore.create({x: 2})
    expect(a).not.toBe(b)
    expect((a.getSnapshot() as {x: number}).x).toBe(1)
    expect((b.getSnapshot() as {x: number}).x).toBe(2)
  })
})

describe('ValtioStore.createGlobal', () => {
  test('创建全局 store 并带初始状态', () => {
    const store = ValtioStore.createGlobal({n: 10})
    expect((store.getSnapshot() as {n: number}).n).toBe(10)
  })

  test('options.devtools: false 不报错', () => {
    const store = ValtioStore.createGlobal({a: 1}, {devtools: false})
    expect((store.getSnapshot() as {a: number}).a).toBe(1)
  })

  test('options.name 传入自定义名称', () => {
    const store = ValtioStore.createGlobal({}, {name: 'MyStore', devtools: false})
    expect(store).toBeDefined()
  })
})
