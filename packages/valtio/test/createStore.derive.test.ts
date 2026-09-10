import {describe, expect, test} from '@rstest/core'
import {createStore} from '../src/index'

describe('createStore derive', () => {
  test('options.derive 返回 { base, derived }', () => {
    const result = createStore(
      {a: 1, b: 2},
      {
        derive: (get, proxy) => ({
          sum: get(proxy).a + get(proxy).b,
        }),
      },
    )
    expect('base' in result).toBe(true)
    expect('derived' in result).toBe(true)
    const {base, derived} = result
    expect(base.toJSON()).toEqual({a: 1, b: 2})
    expect(typeof derived.useSnapshot).toBe('function')
    expect(derived.sum).toBe(3)
  })

  test('base 更新后派生值重新计算', async () => {
    const {base, derived} = createStore(
      {a: 1, b: 2},
      {
        derive: (get, p) => ({sum: get(p).a + get(p).b}),
      },
    )
    base.update({a: 10})
    expect(base.toJSON()).toEqual({a: 10, b: 2})
    await expect.poll(() => derived.sum).toBe(12)
    base.set('b', 5)
    await expect.poll(() => derived.sum).toBe(15)
  })
})
