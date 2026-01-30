import {derive} from 'derive-valtio'
import {useMemo} from 'react'
import type {Snapshot} from 'valtio'
import {proxy, ref, snapshot, subscribe, useSnapshot} from 'valtio'
import {devtools, proxyMap, proxySet, subscribeKey} from 'valtio/utils'
import type {History} from 'valtio-history'
import {proxyWithHistory} from 'valtio-history'

// ============================================
// 类型定义
// ============================================

/** 取消订阅函数 */
export type Unsubscribe = () => void

/** 初始状态：可以是普通对象，或返回对象的函数（惰性初始化） */
export type InitialStateOrFn<T = object> = T | (() => T)

/** 派生函数：接收 get(proxy) 得到快照，返回派生出的新状态 */
export type DeriveFn<TProxy, TDerived> = (get: (proxy: TProxy) => Snapshot<TProxy>, proxy: TProxy) => TDerived

/** 创建 Store 时的可选配置 */
export interface CreateOptions {
  devtools?: boolean
  name?: string
}

/** 历史记录选项 */
export type WithHistoryOptions = Parameters<typeof proxyWithHistory>[1] extends infer O
  ? O extends Record<string, unknown>
    ? O & {limit?: number}
    : {limit?: number}
  : {limit?: number}

/** 带历史记录的 snapshot 类型 */
export interface WithHistorySnapshot<T extends object> {
  value: Snapshot<T>
  history: History<T>
  readonly isUndoEnabled: boolean
  readonly isRedoEnabled: boolean
  undo: () => void
  redo: () => void
}

/** 异步 Store 的扩展状态 */
export interface AsyncStoreState {
  _loading: Record<string, boolean>
  _error: Record<string, unknown>
}

// ============================================
// 工具函数
// ============================================

/** 解析初始状态 */
function resolveInitialState<T>(initialStateOrFn: InitialStateOrFn<T>): T {
  return typeof initialStateOrFn === 'function' ? (initialStateOrFn as () => T)() : initialStateOrFn
}

/** 从快照中筛出可序列化字段（去掉 function/symbol） */
function toJSONFromSnapshot(snap: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key in snap) {
    const value = snap[key]
    if (typeof value !== 'function' && typeof value !== 'symbol') {
      result[key] = value
    }
  }
  return result
}

// ============================================
// 增强 Store 的方法集
// ============================================

/** Store 的基础方法接口 */
export interface StoreBaseMethods<T extends object> {
  getSnapshot(): Snapshot<T>
  /** 在组件内订阅快照（React Hook），推荐全局 store 使用 */
  useSnapshot(): Snapshot<T>
  subscribe(callback: () => void, notifyInSync?: boolean): Unsubscribe
  subscribeKey<K extends keyof T>(key: K, callback: (value: T[K]) => void): Unsubscribe
  subscribeKeys<K extends keyof T>(keys: K[], callback: (key: K, value: T[K]) => void): Unsubscribe
  update(updates: Partial<T>): void
  set<K extends keyof T>(key: K, value: T[K]): void
  setNested(path: string, value: unknown): void
  delete<K extends keyof T>(key: K): void
  reset(initialState: T): void
  ref<V>(value: V): V
  batch(fn: (store: T) => void): void
  clone(): T
  toJSON(): Record<string, unknown>
  fromJSON(json: Record<string, unknown>): void
  persist(key: string): Unsubscribe
  debug(label?: string): void
}

/** 增强 store，添加常用方法 */
export function enhanceStore<T extends object>(store: T, initialState?: T): T & StoreBaseMethods<T> {
  const enhanced = store as T & StoreBaseMethods<T>

  // 用闭包固定 store 引用，避免 "Please use proxy object" 错误
  enhanced.getSnapshot = function () {
    return snapshot(store) as Snapshot<T>
  }

  enhanced.useSnapshot = function useSnapshotFromStore() {
    return useSnapshot(store) as Snapshot<T>
  }

  enhanced.toJSON = function () {
    return toJSONFromSnapshot(snapshot(store) as Record<string, unknown>)
  }

  enhanced.subscribe = function (callback: () => void, notifyInSync = false) {
    return subscribe(store, callback, notifyInSync)
  }

  enhanced.subscribeKey = function <K extends keyof T>(key: K, callback: (value: T[K]) => void) {
    return subscribeKey(store, key, callback as (value: unknown) => void)
  }

  enhanced.subscribeKeys = function <K extends keyof T>(keys: K[], callback: (key: K, value: T[K]) => void) {
    const unsubscribers = keys.map(k => subscribeKey(store, k, value => callback(k, value as T[K])))
    return () => unsubscribers.forEach(unsub => unsub())
  }

  enhanced.update = function (updates: Partial<T>) {
    Object.assign(store, updates)
  }

  enhanced.set = function <K extends keyof T>(key: K, value: T[K]) {
    store[key] = value
  }

  enhanced.setNested = function (path: string, value: unknown) {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce(
      (obj: Record<string, unknown>, k: string) => obj[k] as Record<string, unknown>,
      store as unknown as Record<string, unknown>,
    )
    target[lastKey] = value
  }

  enhanced.delete = function <K extends keyof T>(key: K) {
    delete store[key]
  }

  enhanced.reset = function (resetState: T) {
    // 清除当前数据字段（保留方法）
    for (const key of Object.keys(store)) {
      if (typeof store[key as keyof T] !== 'function') {
        delete store[key as keyof T]
      }
    }
    Object.assign(store, resetState)
  }

  enhanced.ref = function <V>(value: V) {
    return ref(value as object) as V
  }

  enhanced.batch = function (fn: (store: T) => void) {
    fn(store)
  }

  enhanced.clone = function () {
    const snap = snapshot(store)
    const cloned = JSON.parse(JSON.stringify(snap)) as T
    return enhanceStore(proxy(cloned), cloned)
  }

  enhanced.fromJSON = function (json: Record<string, unknown>) {
    Object.assign(store, json)
  }

  enhanced.persist = function (key: string) {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        enhanced.fromJSON(JSON.parse(saved))
      } catch (err) {
        console.error('Failed to restore from localStorage:', err)
      }
    }

    return subscribe(store, () => {
      try {
        localStorage.setItem(key, JSON.stringify(enhanced.toJSON()))
      } catch (err) {
        console.error('Failed to save to localStorage:', err)
      }
    })
  }

  enhanced.debug = function (label = 'Store State') {
    console.group(label)
    console.log(snapshot(store))
    console.groupEnd()
  }

  return enhanced
}

// ============================================
// 基础 Store 创建
// ============================================

/**
 * 创建基础 store
 * @param initialState 初始状态
 * @param options 配置选项（devtools、name）
 * @returns 增强后的 store
 */
export function createStore<T extends object>(
  initialState: T,
  options: CreateOptions = {
    devtools: true,
  },
): T & StoreBaseMethods<T> {
  const proxied = proxy(initialState) as T
  const enhanced = enhanceStore(proxied, initialState)

  if (process.env.NODE_ENV === 'development' && options?.devtools !== false) {
    devtools(proxied, {name: options?.name ?? 'Store'})
  }

  return enhanced
}

/**
 * React Hook - 创建局部 store
 * @param initialState 初始状态或惰性初始化函数
 * @returns [snapshot, store]
 */
export function useStore<T extends object>(initialState: InitialStateOrFn<T>): [Snapshot<T>, T & StoreBaseMethods<T>] {
  const store = useMemo(() => {
    const state = resolveInitialState(initialState)
    const proxied = proxy(state) as T
    return enhanceStore(proxied, state)
  }, [])

  const snap = useSnapshot(store) as Snapshot<T>
  return [snap, store]
}

// ============================================
// 带历史记录的 Store
// ============================================

/**
 * 创建带历史记录的 store
 * @param initialState 初始状态
 * @param options 历史记录选项（limit 等）
 * @returns valtio-history 返回的 store 结构
 */
export function createStoreWithHistory<T extends object>(initialState: T, options: WithHistoryOptions = {}) {
  return proxyWithHistory(initialState, options as Parameters<typeof proxyWithHistory>[1])
}

/**
 * React Hook - 创建带历史记录的局部 store
 * @param initialState 初始状态或惰性初始化函数
 * @param options 历史记录选项
 * @returns [snapshot, store]
 */
export function useStoreWithHistory<T extends object>(
  initialState: InitialStateOrFn<T>,
  options: WithHistoryOptions = {},
): [WithHistorySnapshot<T>, ReturnType<typeof proxyWithHistory<T>>] {
  const store = useMemo(() => {
    const state = resolveInitialState(initialState)
    return proxyWithHistory(state, options as Parameters<typeof proxyWithHistory>[1])
  }, [])

  const snap = useSnapshot(store) as unknown as WithHistorySnapshot<T>
  return [snap, store]
}

// ============================================
// 带派生状态的 Store
// ============================================

/**
 * 创建带派生状态的 store
 * @param initialState 初始状态
 * @param deriveFn 派生函数
 * @returns { base, derived }
 */
export function createStoreWithDerived<T extends object, D>(initialState: T, deriveFn: DeriveFn<T, D>) {
  const proxied = proxy(initialState) as T
  const baseStore = enhanceStore(proxied, initialState)
  const derivedState = derive(deriveFn, {proxy: proxied})

  return {
    base: baseStore,
    derived: derivedState,
  }
}

/**
 * React Hook - 创建带派生状态的局部 store
 * @param initialState 初始状态或惰性初始化函数
 * @param deriveFn 派生函数
 * @returns [baseSnapshot, baseStore, derivedSnapshot]
 */
export function useStoreWithDerived<T extends object, D>(
  initialState: InitialStateOrFn<T>,
  deriveFn: DeriveFn<T, D>,
): [Snapshot<T>, T & StoreBaseMethods<T>, D] {
  const config = useMemo(() => {
    const state = resolveInitialState(initialState)
    const proxied = proxy(state) as T
    const baseStore = enhanceStore(proxied, state)
    const derivedState = derive(deriveFn, {proxy: proxied})

    return {base: baseStore, derived: derivedState}
  }, [])

  const baseSnap = useSnapshot(config.base) as Snapshot<T>
  const derivedSnap = useSnapshot(config.derived) as D

  return [baseSnap, config.base, derivedSnap]
}

// ============================================
// 异步 Store
// ============================================

/** 异步 Store 的完整类型（asyncFn 按实参推导，无需外置类型断言） */
export interface AsyncStore<T extends object> extends StoreBaseMethods<T & AsyncStoreState> {
  async<K extends string, F extends (...args: any[]) => Promise<any>>(
    key: K,
    asyncFn: F,
  ): (...args: Parameters<F>) => ReturnType<F>
}

/**
 * 创建异步 store，自动管理 _loading 和 _error
 * @param initialState 初始状态
 * @returns 增强后的异步 store
 */
export function createAsyncStore<T extends object>(initialState: T): T & AsyncStoreState & AsyncStore<T> {
  const stateWithAsync = {
    ...initialState,
    _loading: {} as Record<string, boolean>,
    _error: {} as Record<string, unknown>,
  }

  const proxied = proxy(stateWithAsync)
  const enhanced = enhanceStore(proxied, stateWithAsync) as T & AsyncStoreState & AsyncStore<T>

  // 添加 async 方法（F 由调用处推导，返回类型与 asyncFn 一致）
  enhanced.async = function <K extends string, F extends (...args: any[]) => Promise<any>>(key: K, asyncFn: F) {
    return (async (...args: Parameters<F>) => {
      enhanced._loading[key] = true
      enhanced._error[key] = null

      try {
        const result = await asyncFn(...args)
        enhanced._loading[key] = false
        return result
      } catch (error) {
        enhanced._error[key] = error
        enhanced._loading[key] = false
        throw error
      }
    }) as (...args: Parameters<F>) => ReturnType<F>
  }

  return enhanced
}

/**
 * React Hook - 创建异步局部 store
 * @param initialState 初始状态或惰性初始化函数
 * @returns [snapshot, store]
 */
export function useAsyncStore<T extends object>(
  initialState: InitialStateOrFn<T>,
): [Snapshot<T & AsyncStoreState>, T & AsyncStoreState & AsyncStore<T>] {
  const store = useMemo(() => {
    const state = resolveInitialState(initialState)
    return createAsyncStore(state)
  }, [])

  const snap = useSnapshot(store) as Snapshot<T & AsyncStoreState>
  return [snap, store]
}

// ============================================
// 集合类型工具
// ============================================

/**
 * 创建可代理的 Map
 * @param entries 初始键值对
 * @returns proxyMap
 */
export function createMap<K = string, V = unknown>(entries?: Iterable<[K, V]> | null): Map<K, V> {
  return proxyMap(entries ?? []) as Map<K, V>
}

/**
 * 创建可代理的 Set
 * @param values 初始值
 * @returns proxySet
 */
export function createSet<T = unknown>(values?: Iterable<T> | null): Set<T> {
  return proxySet(values ?? [])
}

// ============================================
// 导出 Valtio 原生工具
// ============================================

export {
  proxy,
  snapshot,
  subscribe,
  subscribeKey,
  ref,
  useSnapshot,
  proxyWithHistory,
  proxyMap,
  proxySet,
  derive,
  devtools,
}
