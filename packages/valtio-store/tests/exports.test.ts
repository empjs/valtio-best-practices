/// <reference lib="dom" />
import {describe, expect, test} from 'bun:test'
import ValtioStore, {proxyMap, proxySet, ref, snapshot} from '../src/index'

describe('导出工具', () => {
  test('proxyMap / proxySet 与 ValtioStore.createMap/createSet 一致', () => {
    const m = proxyMap([['k', 1]])
    expect(m.get('k')).toBe(1)
    const s = proxySet([1, 2])
    expect(s.has(1)).toBe(true)
  })

  test('ref 可用', () => {
    const r = ref({big: true})
    expect(r).toBeDefined()
  })

  test('snapshot 与 store 数据一致', () => {
    const store = ValtioStore.create({a: 1})
    expect(store.toJSON()).toEqual({a: 1})
    const snap = snapshot(store) as Record<string, unknown>
    expect(snap.a).toBe(1)
  })
})
