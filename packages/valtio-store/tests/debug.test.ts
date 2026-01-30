/// <reference lib="dom" />
import {describe, expect, test, mock} from 'bun:test'
import ValtioStore from '../src/index'

describe('debug / getInitialState', () => {
  test('debug 调用 console.group/groupEnd/log', () => {
    const store = ValtioStore.create({a: 1})
    const group = mock(() => {})
    const groupEnd = mock(() => {})
    const log = mock(() => {})
    const origGroup = console.group
    const origGroupEnd = console.groupEnd
    const origLog = console.log
    console.group = group as typeof console.group
    console.groupEnd = groupEnd as typeof console.groupEnd
    console.log = log as typeof console.log
    store.debug('My Label')
    expect(group).toHaveBeenCalledWith('My Label')
    expect(groupEnd).toHaveBeenCalled()
    expect(log).toHaveBeenCalled()
    console.group = origGroup
    console.groupEnd = origGroupEnd
    console.log = origLog
  })

  test('getInitialState 默认返回 {}', () => {
    const store = ValtioStore.create({})
    expect(store.getInitialState()).toEqual({})
  })
})
