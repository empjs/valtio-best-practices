/// <reference lib="dom" />
import {renderHook} from '@testing-library/react'
import {describe, expect, test} from 'bun:test'
import ValtioStore from '../src/index'

describe('createWithHistory / useWithHistory', () => {
  test('createWithHistory 返回带 value/history/undo/redo 的对象', () => {
    const store = ValtioStore.createWithHistory({count: 0})
    expect(store).toHaveProperty('value')
    expect(store).toHaveProperty('history')
    expect(store).toHaveProperty('undo')
    expect(store).toHaveProperty('redo')
    expect((store.value as {count: number}).count).toBe(0)
  })

  test('undo/redo 可调用且 value 可读写', () => {
    const store = ValtioStore.createWithHistory({n: 0})
    expect(typeof store.undo).toBe('function')
    expect(typeof store.redo).toBe('function')
    expect((store.value as {n: number}).n).toBe(0)
    ;(store.value as {n: number}).n = 1
    expect((store.value as {n: number}).n).toBe(1)
  })

  test('useWithHistory 返回 [snap, store]', () => {
    const {result} = renderHook(() => ValtioStore.useWithHistory({count: 0}))
    const [snap, store] = result.current
    expect(snap).toHaveProperty('value')
    expect(store).toHaveProperty('undo')
    expect(store).toHaveProperty('redo')
  })

  test('useWithHistory 支持函数初始状态', () => {
    const {result} = renderHook(() =>
      ValtioStore.useWithHistory(() => ({count: 42})),
    )
    expect((result.current[0].value as {count: number}).count).toBe(42)
  })
})
