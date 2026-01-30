import {derive} from 'derive-valtio'
import {useMemo} from 'react'
import type {Snapshot} from 'valtio'
import {proxy, ref, snapshot, subscribe, useSnapshot} from 'valtio'
import {devtools, proxyMap, proxySet, subscribeKey} from 'valtio/utils'
import {proxyWithHistory} from 'valtio-history'

// ============================================
// 类型定义
// ============================================

export interface CreateOptions {
  devtools?: boolean
  name?: string
}

export type InitialStateOrFn<T = Record<string, unknown>> = T | (() => T)

/** 派生函数：接收 get(proxy) 返回派生状态 */
export type DeriveFn<TProxy, TDerived> = (get: (proxy: TProxy) => Snapshot<TProxy>) => TDerived

/** 带 _loading/_error 的异步 Store 状态 */
export interface AsyncStoreState<T = Record<string, unknown>> {
  _loading?: Record<string, boolean>
  _error?: Record<string, unknown>
  [key: string]: unknown
}

/** 带 async 方法的 Store 类型 */
export interface AsyncStoreWithMethods<T = Record<string, unknown>> extends ValtioStore, AsyncStoreState<T> {
  async<K extends string>(
    key: K,
    asyncFn: (...args: unknown[]) => Promise<unknown>,
  ): (...args: unknown[]) => Promise<unknown>
}

/** 取消订阅函数 */
export type Unsubscribe = () => void

/**
 * ValtioStore v3 - 终极优化版本
 *
 * 解决的核心问题：
 * 1. ✅ 引用方式简化 - 提供 use() Hook，自动管理实例
 * 2. ✅ 状态隔离 - 每个组件独立实例，避免状态共享
 * 3. ✅ 支持全局/局部模式 - 灵活切换
 * 4. ✅ 保留 v2 所有优化特性
 */
class ValtioStore {
  [key: string]: unknown

  // ============================================
  // 核心创建方法
  // ============================================

  /**
   * 创建全局单例 Store（所有组件共享）
   */
  static createGlobal<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    options: CreateOptions = {},
  ): ValtioStore & T {
    const instance = new ValtioStore()
    Object.assign(instance, initialState)
    const proxied = proxy(instance) as ValtioStore & T

    if (process.env.NODE_ENV === 'development' && options.devtools !== false) {
      devtools(proxied, {name: options.name ?? ValtioStore.name + ' (Global)'})
    }

    return proxied
  }

  /**
   * 创建局部实例（每次调用返回新实例）
   */
  static createLocal<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    _options: CreateOptions = {},
  ): ValtioStore & T {
    const instance = new ValtioStore()
    Object.assign(instance, initialState)
    return proxy(instance) as ValtioStore & T
  }

  /**
   * React Hook - 自动管理局部实例（推荐）
   * 每个组件有独立的 store 实例
   */
  static useLocal<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState?: InitialStateOrFn<T>,
  ): [Snapshot<ValtioStore & T>, ValtioStore & T] {
    const store = useMemo(() => {
      const instance = new ValtioStore()
      const initial =
        typeof initialState === 'function'
          ? (initialState as () => T)()
          : (initialState ?? (instance.getInitialState() as T))
      Object.assign(instance, initial)
      return proxy(instance) as ValtioStore & T
    }, [])

    const snap = useSnapshot(store)
    return [snap, store]
  }

  /**
   * React Hook - 使用全局单例
   * 所有组件共享同一个 store
   */
  static useGlobal<T extends object>(globalStore: T): [Snapshot<T>, T] {
    const snap = useSnapshot(globalStore) as Snapshot<T>
    return [snap, globalStore]
  }

  /**
   * 向后兼容的 create 方法（默认全局）
   */
  static create<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    options: CreateOptions = {},
  ): ValtioStore & T {
    return ValtioStore.createGlobal(initialState, options)
  }

  // ============================================
  // 带特性的工厂方法
  // ============================================

  /**
   * 创建带历史记录的 store
   */
  static createWithHistory<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    options: Parameters<typeof proxyWithHistory>[1] = {},
  ) {
    const instance = new ValtioStore()
    Object.assign(instance, initialState)
    return proxyWithHistory(instance, options)
  }

  /**
   * React Hook - 带历史记录（局部）
   */
  static useLocalWithHistory<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState?: InitialStateOrFn<T>,
    options: Parameters<typeof proxyWithHistory>[1] = {},
  ) {
    const store = useMemo(() => {
      const instance = new ValtioStore()
      const initial =
        typeof initialState === 'function'
          ? (initialState as () => T)()
          : (initialState ?? (instance.getInitialState() as T))
      Object.assign(instance, initial)
      return proxyWithHistory(instance, options)
    }, [])

    const snap = useSnapshot(store)
    return [snap, store]
  }

  /**
   * 创建带派生状态的 store
   */
  static createWithDerived<TBase extends Record<string, unknown>, TDerived>(
    initialState: TBase,
    deriveFn: DeriveFn<ValtioStore & TBase, TDerived>,
  ) {
    const baseStore = ValtioStore.createLocal(initialState)
    const derivedState = derive(deriveFn, {proxy: baseStore})

    return {
      base: baseStore,
      derived: derivedState,
    }
  }

  /**
   * React Hook - 带派生状态（局部）
   */
  static useLocalWithDerived<TBase extends Record<string, unknown>, TDerived>(
    initialState: InitialStateOrFn<TBase> | undefined,
    deriveFn: DeriveFn<ValtioStore & TBase, TDerived>,
  ) {
    const config = useMemo(() => {
      const instance = new ValtioStore()
      const initial =
        typeof initialState === 'function'
          ? (initialState as () => TBase)()
          : (initialState ?? (instance.getInitialState() as TBase))
      Object.assign(instance, initial)
      const baseStore = proxy(instance) as ValtioStore & TBase
      const derivedState = derive(deriveFn, {proxy: baseStore})

      return {base: baseStore, derived: derivedState}
    }, [])

    const baseSnap = useSnapshot(config.base)
    const derivedSnap = useSnapshot(config.derived)

    return [baseSnap, config.base, derivedSnap]
  }

  /**
   * 创建 Map/Set
   */
  static createMap<T = unknown>(entries?: Iterable<[string, T]> | null): Map<string, T> {
    return proxyMap(entries ?? []) as Map<string, T>
  }

  static createSet<T = unknown>(values?: Iterable<T> | null): Set<T> {
    return proxySet(values ?? [])
  }

  // ============================================
  // 实例方法
  // ============================================

  getSnapshot(): Snapshot<this> {
    return snapshot(this) as Snapshot<this>
  }

  subscribe(callback: () => void, notifyInSync = false): Unsubscribe {
    return subscribe(this, callback, notifyInSync)
  }

  subscribeKey(key: string, callback: (value: unknown) => void): Unsubscribe {
    return subscribeKey(this, key, callback)
  }

  subscribeKeys(keys: string[], callback: (key: string, value: unknown) => void): Unsubscribe {
    const unsubscribers = keys.map(k => subscribeKey(this, k, value => callback(k, value)))
    return () => unsubscribers.forEach(unsub => unsub())
  }

  update(updates: Record<string, unknown>): void {
    Object.assign(this, updates)
  }

  set(key: string, value: unknown): void {
    this[key] = value
  }

  setNested(path: string, value: unknown): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce(
      (obj: Record<string, unknown>, k: string) => obj[k] as Record<string, unknown>,
      this as unknown as Record<string, unknown>,
    )
    target[lastKey] = value
  }

  delete(key: string): void {
    delete this[key]
  }

  reset(): void {
    const initial = this.getInitialState() as Record<string, unknown>
    for (const key of Object.keys(this)) {
      if (typeof this[key] !== 'function') {
        delete this[key]
      }
    }
    Object.assign(this, initial)
  }

  ref<T>(value: T): T {
    return ref(value as object) as T
  }

  batch(fn: (store: this) => void): void {
    fn(this)
  }

  clone(): ValtioStore & Record<string, unknown> {
    const snap = this.getSnapshot()
    const cloned = JSON.parse(JSON.stringify(snap)) as Record<string, unknown>
    return (this.constructor as typeof ValtioStore).createLocal(cloned)
  }

  toJSON(): Record<string, unknown> {
    const snap = this.getSnapshot() as Record<string, unknown>
    const result: Record<string, unknown> = {}

    for (const key in snap) {
      const value = snap[key]
      if (typeof value === 'function' || typeof value === 'symbol') {
        continue
      }
      result[key] = value
    }

    return result
  }

  fromJSON(json: Record<string, unknown>): void {
    this.update(json)
  }

  persist(key: string): Unsubscribe {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        this.fromJSON(JSON.parse(saved) as Record<string, unknown>)
      } catch (err) {
        console.error('Failed to restore from localStorage:', err)
      }
    }

    return this.subscribe(() => {
      try {
        localStorage.setItem(key, JSON.stringify(this.toJSON()))
      } catch (err) {
        console.error('Failed to save to localStorage:', err)
      }
    })
  }

  debug(label = 'Store State'): void {
    console.group(label)
    console.log(this.getSnapshot())
    console.groupEnd()
  }

  getInitialState(): Record<string, unknown> {
    return {}
  }

  // ============================================
  // 高级模式
  // ============================================

  static createAsync<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
  ): AsyncStoreWithMethods<T> {
    const enhanced: AsyncStoreState<T> = {
      ...initialState,
      _loading: {},
      _error: {},
    }

    const instance = ValtioStore.createLocal(enhanced as Record<string, unknown>) as AsyncStoreWithMethods<T>

    instance.async = function (key: string, asyncFn: (...args: unknown[]) => Promise<unknown>) {
      return async (...args: unknown[]) => {
        this._loading = this._loading ?? {}
        this._error = this._error ?? {}
        this._loading[key] = true
        this._error[key] = null

        try {
          const result = await asyncFn.apply(this, args)
          this._loading[key] = false
          return result
        } catch (error) {
          this._error[key] = error
          this._loading[key] = false
          throw error
        }
      }
    }

    return instance
  }

  static useLocalAsync<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState?: InitialStateOrFn<T>,
  ): [Snapshot<AsyncStoreWithMethods<T>>, AsyncStoreWithMethods<T>] {
    const store = useMemo(() => {
      const initial = typeof initialState === 'function' ? (initialState as () => T)() : ((initialState ?? {}) as T)

      const enhanced: AsyncStoreState<T> = {
        ...initial,
        _loading: {},
        _error: {},
      }

      const instance = new ValtioStore()
      Object.assign(instance, enhanced)
      const proxied = proxy(instance) as AsyncStoreWithMethods<T>

      proxied.async = function (key: string, asyncFn: (...args: unknown[]) => Promise<unknown>) {
        return async (...args: unknown[]) => {
          this._loading = this._loading ?? {}
          this._error = this._error ?? {}
          this._loading[key] = true
          this._error[key] = null

          try {
            const result = await asyncFn.apply(this, args)
            this._loading[key] = false
            return result
          } catch (error) {
            this._error[key] = error
            this._loading[key] = false
            throw error
          }
        }
      }

      return proxied
    }, [])

    const snap = useSnapshot(store)
    return [snap, store]
  }
}

export default ValtioStore

// 导出所有工具
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
