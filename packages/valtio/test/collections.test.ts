import { describe, expect, test } from 'bun:test'
import { createMap, createSet, createStore } from '../src/index'

describe('createMap', () => {
  test('无参返回空 Map', () => {
    const map = createMap()
    expect(map.size).toBe(0)
  })

  test('entries 初始化', () => {
    const map = createMap([
      ['a', 1],
      ['b', 2],
    ])
    expect(map.size).toBe(2)
    expect(map.get('a')).toBe(1)
    expect(map.get('b')).toBe(2)
  })

  test('set/get 响应式（可放入 store 快照）', () => {
    const map = createMap<string, number>([['x', 0]])
    map.set('x', 3)
    expect(map.get('x')).toBe(3)
  })
})

describe('createSet', () => {
  test('无参返回空 Set', () => {
    const set = createSet()
    expect(set.size).toBe(0)
  })

  test('values 初始化', () => {
    const set = createSet([1, 2, 3])
    expect(set.size).toBe(3)
    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(true)
  })

  test('add/has 响应式', () => {
    const set = createSet<number>([1])
    set.add(2)
    expect(set.has(2)).toBe(true)
  })
})
