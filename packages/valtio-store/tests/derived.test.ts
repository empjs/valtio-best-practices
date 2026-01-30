/// <reference lib="dom" />
import {renderHook} from '@testing-library/react'
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('createWithDerived / useWithDerived', () => {
  test('createWithDerived 返回 base 与 derived', () => {
    const {base, derived} = ValtioStore.createWithDerived(
      {a: 1, b: 2},
      (get, proxy) => {
        const s = get(proxy)
        return {sum: (s as {a: number}).a + (s as {b: number}).b}
      },
    )
    expect(base.toJSON()).toMatchObject({a: 1, b: 2})
    expect(derived).toBeDefined()
    base.set('a', 10)
    expect(base.toJSON()).toMatchObject({a: 10, b: 2})
  })

  test('useWithDerived 返回 [baseSnap, baseStore, derivedSnap]', () => {
    const {result} = renderHook(() =>
      ValtioStore.useWithDerived({x: 1}, (get, proxy) => {
        const s = get(proxy)
        return {double: (s as {x: number}).x * 2}
      }),
    )
    const [baseSnap, baseStore, derivedSnap] = result.current
    expect(baseSnap).toMatchObject({x: 1})
    expect(result.current).toHaveLength(3)
    expect(baseStore).toBeDefined()
    expect(derivedSnap).toBeDefined()
  })

  test('useWithDerived 支持函数初始状态', () => {
    const {result} = renderHook(() =>
      ValtioStore.useWithDerived(() => ({v: 10}), (get, proxy) => {
        const s = get(proxy)
        return {v: (s as {v: number}).v }
      }),
    )
    expect(result.current[0]).toMatchObject({v: 10})
    expect(result.current[2]).toMatchObject({v: 10})
  })
})
