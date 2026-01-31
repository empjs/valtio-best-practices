import {derive} from 'derive-valtio'
import {useMemo} from 'react'
import type {Snapshot} from 'valtio'
import {proxy, ref, snapshot, subscribe, useSnapshot} from 'valtio'
import {deepClone, devtools, proxyMap, proxySet, subscribeKey} from 'valtio/utils'
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

/** 创建 Store 时的可选配置（仅基础） */
export interface CreateOptionsBase {
  devtools?: boolean
  name?: string
}

/** 历史记录选项 */
export type WithHistoryOptions = Parameters<typeof proxyWithHistory>[1]

/** 创建 Store 时的可选配置（支持 history、derive） */
export interface CreateOptions<T = object, D = unknown> extends CreateOptionsBase {
  history?: WithHistoryOptions
  derive?: DeriveFn<T, D>
}

/** 带历史记录的 snapshot 类型 */
export interface WithHistorySnapshot<T extends object> {
  value: Snapshot<T>
  history: History<T>
  readonly isUndoEnabled: boolean
  readonly isRedoEnabled: boolean
  undo: () => void
  redo: () => void
}

/** proxyWithHistory 的返回类型 */
export type HistoryStore<T extends object> = ReturnType<typeof proxyWithHistory<T>>

/** 带历史的 createStore 返回（含 useSnapshot，与普通 store 用法一致） */
export type HistoryStoreWithSnapshot<T extends object> = HistoryStore<T> & {
  useSnapshot(): WithHistorySnapshot<T>
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
    const snap = snapshot(store) as T
    // deepClone 能正确处理 ref、Date 等，比 JSON 往返更可靠（valtio/utils）
    const cloned = deepClone(snap) as T
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
// createStore（支持常规 / history / derive）
// ============================================

/** 带 derive 时的返回：base + derived（均含 useSnapshot，与普通 store 用法一致） */
export interface StoreWithDerived<T extends object, D> {
  base: T & StoreBaseMethods<T>
  derived: object & {useSnapshot(): D}
}

function createStoreImpl<T extends object>(
  initialState: T,
  options?: CreateOptionsBase & {history?: WithHistoryOptions; derive?: DeriveFn<T, unknown>},
): (T & StoreBaseMethods<T>) | HistoryStore<T> | StoreWithDerived<T, unknown> {
  const opts = options ?? {}
  if (opts.history != null) {
    const histOptions = opts.history as Parameters<typeof proxyWithHistory>[1]
    const hist = proxyWithHistory(initialState, histOptions) as HistoryStoreWithSnapshot<T>
    hist.useSnapshot = function useSnapshotFromStore() {
      return useSnapshot(hist) as unknown as WithHistorySnapshot<T>
    }
    return hist
  }
  if (opts.derive != null) {
    const proxied = proxy(initialState) as T
    const baseStore = enhanceStore(proxied, initialState)
    const derivedState = derive(opts.derive, {proxy: proxied}) as object & {useSnapshot?: () => unknown}
    derivedState.useSnapshot = function useSnapshotFromDerived() {
      return useSnapshot(derivedState)
    }
    return {base: baseStore, derived: derivedState} as StoreWithDerived<T, unknown>
  }
  const proxied = proxy(initialState) as T
  const enhanced = enhanceStore(proxied, initialState)
  if (process.env.NODE_ENV === 'development' && opts.devtools !== false) {
    devtools(proxied, {name: opts.name ?? 'Store'})
  }
  return enhanced
}

/**
 * 创建 store（常规 / 带历史 / 带派生）
 * @param initialState 初始状态
 * @param options 配置：devtools、name；或 history、或 derive
 * @returns 增强后的 store，或 { base, derived }（当 options.derive 时）
 */
export function createStore<T extends object>(
  initialState: T,
  options: CreateOptionsBase & {history: WithHistoryOptions},
): HistoryStoreWithSnapshot<T>
export function createStore<T extends object, D>(
  initialState: T,
  options: CreateOptionsBase & {derive: DeriveFn<T, D>},
): StoreWithDerived<T, D>
export function createStore<T extends object>(
  initialState: T,
  options?: CreateOptionsBase & {history?: WithHistoryOptions},
): T & StoreBaseMethods<T>
export function createStore<T extends object, D>(
  initialState: T,
  options?: CreateOptions<T, D>,
): (T & StoreBaseMethods<T>) | HistoryStoreWithSnapshot<T> | StoreWithDerived<T, D> {
  return createStoreImpl(initialState, options) as
    | (T & StoreBaseMethods<T>)
    | HistoryStoreWithSnapshot<T>
    | StoreWithDerived<T, D>
}

// ============================================
// useStore（支持常规 / history / derive）
// ============================================

/** useStore 的 options（仅 history / derive，无 devtools/name） */
export interface UseStoreOptions<T = object, D = unknown> {
  history?: WithHistoryOptions
  derive?: DeriveFn<T, D>
}

function useStoreImpl<T extends object>(
  initialState: InitialStateOrFn<T>,
  options?: UseStoreOptions<T, unknown>,
): [Snapshot<T> | WithHistorySnapshot<T>, (T & StoreBaseMethods<T>) | HistoryStore<T>, unknown?] {
  const opts = options ?? {}
  if (opts.history != null) {
    const histOptions = opts.history as Parameters<typeof proxyWithHistory>[1]
    const store = useMemo(() => {
      const state = resolveInitialState(initialState)
      return proxyWithHistory(state, histOptions)
    }, [])
    const snap = useSnapshot(store) as unknown as WithHistorySnapshot<T>
    return [snap, store as HistoryStore<T>]
  }
  if (opts.derive != null) {
    const config = useMemo(() => {
      const state = resolveInitialState(initialState)
      const proxied = proxy(state) as T
      const baseStore = enhanceStore(proxied, state)
      const derivedState = derive(opts.derive!, {proxy: proxied})
      return {base: baseStore, derived: derivedState}
    }, [])
    const baseSnap = useSnapshot(config.base) as Snapshot<T>
    const derivedSnap = useSnapshot(config.derived)
    return [baseSnap, config.base, derivedSnap]
  }
  const store = useMemo(() => {
    const state = resolveInitialState(initialState)
    const proxied = proxy(state) as T
    return enhanceStore(proxied, state)
  }, [])
  const snap = useSnapshot(store) as Snapshot<T>
  return [snap, store]
}

/**
 * React Hook - 创建局部 store（常规 / 带历史 / 带派生）
 * @param initialState 初始状态或惰性初始化函数
 * @param options 可选：history 或 derive
 * @returns [snapshot, store] 或 [baseSnap, baseStore, derivedSnap]（当 options.derive 时）
 */
export function useStore<T extends object>(initialState: InitialStateOrFn<T>): [Snapshot<T>, T & StoreBaseMethods<T>]
export function useStore<T extends object>(
  initialState: InitialStateOrFn<T>,
  options: UseStoreOptions<T> & {history: WithHistoryOptions},
): [WithHistorySnapshot<T>, HistoryStore<T>]
export function useStore<T extends object, D>(
  initialState: InitialStateOrFn<T>,
  options: UseStoreOptions<T, D> & {derive: DeriveFn<T, D>},
): [Snapshot<T>, T & StoreBaseMethods<T>, D]
export function useStore<T extends object, D>(
  initialState: InitialStateOrFn<T>,
  options?: UseStoreOptions<T, D>,
):
  | [Snapshot<T>, T & StoreBaseMethods<T>]
  | [WithHistorySnapshot<T>, HistoryStore<T>]
  | [Snapshot<T>, T & StoreBaseMethods<T>, D] {
  return useStoreImpl(initialState, options) as
    | [Snapshot<T>, T & StoreBaseMethods<T>]
    | [WithHistorySnapshot<T>, HistoryStore<T>]
    | [Snapshot<T>, T & StoreBaseMethods<T>, D]
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
