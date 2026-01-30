/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('createMap / createSet', () => {
  test('createMap 空或带 entries', () => {
    const empty = ValtioStore.createMap()
    expect(empty.size).toBe(0)
    const withEntries = ValtioStore.createMap([
      ['a', 1],
      ['b', 2],
    ])
    expect(withEntries.get('a')).toBe(1)
    expect(withEntries.get('b')).toBe(2)
  })

  test('createMap(null) 等价空 Map', () => {
    const m = ValtioStore.createMap(null)
    expect(m.size).toBe(0)
  })

  test('createSet 空或带 values', () => {
    const empty = ValtioStore.createSet()
    expect(empty.size).toBe(0)
    const withValues = ValtioStore.createSet([1, 2, 3])
    expect(withValues.has(1)).toBe(true)
    expect(withValues.size).toBe(3)
  })

  test('createSet(null) 等价空 Set', () => {
    const s = ValtioStore.createSet(null)
    expect(s.size).toBe(0)
  })
})
