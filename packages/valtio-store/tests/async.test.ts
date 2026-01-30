/// <reference lib="dom" />

import {describe, expect, test} from 'bun:test'
import {renderHook} from '@testing-library/react'
import ValtioStore from '../src/index'

describe('createAsync / useAsync', () => {
  test('createAsync 带 _loading/_error 和 async 方法', () => {
    const store = ValtioStore.createAsync({}) as ReturnType<typeof ValtioStore.createAsync>
    expect(store).toHaveProperty('_loading')
    expect(store).toHaveProperty('_error')
    expect(typeof store.async).toBe('function')
  })

  test('async(key, fn) 成功时更新 _loading/_error', async () => {
    const store = ValtioStore.createAsync({}) as ReturnType<typeof ValtioStore.createAsync>
    const run = store.async('fetch', async () => 'ok')
    expect(store._loading?.fetch).toBeFalsy()
    const p = run()
    expect(store._loading?.fetch).toBe(true)
    const result = await p
    expect(result).toBe('ok')
    expect(store._loading?.fetch).toBe(false)
    expect(store._error?.fetch).toBeNull()
  })

  test('async(key, fn) 失败时设置 _error 并 rethrow', async () => {
    const store = ValtioStore.createAsync({}) as ReturnType<typeof ValtioStore.createAsync>
    const err = new Error('fail')
    const run = store.async('fetch', async () => {
      throw err
    })
    await expect(run()).rejects.toBe(err)
    expect(store._error?.fetch).toBe(err)
    expect(store._loading?.fetch).toBe(false)
  })

  test('useAsync 返回 [snap, store]', () => {
    const {result} = renderHook(() => ValtioStore.useAsync({}))
    const [snap, store] = result.current
    expect(snap).toHaveProperty('_loading')
    expect(store.async).toBeDefined()
  })

  test('useAsync 支持函数初始状态', () => {
    const {result} = renderHook(() => ValtioStore.useAsync(() => ({id: 1})))
    expect((result.current[0] as {id?: number}).id).toBe(1)
  })

  test('useAsync() 无参时使用空对象', () => {
    const {result} = renderHook(() => ValtioStore.useAsync())
    const [snap] = result.current
    expect(snap).toHaveProperty('_loading')
    expect(snap).toHaveProperty('_error')
  })
})
