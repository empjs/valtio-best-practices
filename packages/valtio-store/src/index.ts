/**
 * @empjs/valtio-store - 基于 Valtio 的 Store 封装
 *
 * 提供：统一 use() 入口、局部/全局模式、子类实例方法、getSnapshot/toJSON 闭包防抖等
 */
import {derive} from 'derive-valtio'
import {useMemo} from 'react'
import type {Snapshot} from 'valtio'
import {proxy, ref, snapshot, subscribe, useSnapshot} from 'valtio'
import {devtools, proxyMap, proxySet, subscribeKey} from 'valtio/utils'
import {proxyWithHistory} from 'valtio-history'

// ============================================
// 类型定义
// ============================================

/** 创建 Store 时的可选配置（如是否开启 devtools、显示名称） */
export interface CreateOptions {
  devtools?: boolean
  name?: string
}

/** 初始状态：可以是普通对象，或返回对象的函数（惰性初始化） */
export type InitialStateOrFn<T = Record<string, unknown>> = T | (() => T)

/** 派生函数：接收 get(proxy) 得到快照，返回派生出的新状态（如 total、count） */
export type DeriveFn<TProxy, TDerived> = (get: (proxy: TProxy) => Snapshot<TProxy>) => TDerived

/** 异步 Store 的扩展状态：_loading[key]、_error[key] 用于表示某次 async 的加载中/错误 */
export interface AsyncStoreState<T = Record<string, unknown>> {
  _loading?: Record<string, boolean>
  _error?: Record<string, unknown>
  [key: string]: unknown
}

/** 带 async(key, fn) 方法的 Store：用于包装异步方法并自动维护 _loading/_error */
export interface AsyncStoreWithMethods<T = Record<string, unknown>> extends ValtioStore, AsyncStoreState<T> {
  async<K extends string>(
    key: K,
    asyncFn: (...args: unknown[]) => Promise<unknown>,
  ): (...args: unknown[]) => Promise<unknown>
}

/** 取消订阅：subscribe / subscribeKey 等返回的函数，调用即取消监听 */
export type Unsubscribe = () => void

/**
 * 用闭包固定 proxy 引用，重写 getSnapshot / toJSON。
 * 当 JSON.stringify(store) 或 devtools 等无 receiver 调用 toJSON/getSnapshot 时，
 * 不会丢失 this，始终对同一个 proxy 调用 snapshot(proxy)，避免 "Please use proxy object"。
 */
function bindProxyMethods<T extends ValtioStore>(proxied: T): T {
  const p = proxied
  proxied.getSnapshot = function getSnapshot() {
    return snapshot(p) as Snapshot<T>
  }
  proxied.toJSON = function toJSON(): Record<string, unknown> {
    const snap = snapshot(p) as Record<string, unknown>
    const result: Record<string, unknown> = {}
    for (const key in snap) {
      const value = snap[key]
      if (typeof value !== 'function' && typeof value !== 'symbol') result[key] = value
    }
    return result
  }
  proxied.clone = proxied.clone.bind(proxied)
  proxied.subscribe = proxied.subscribe.bind(proxied)
  proxied.subscribeKey = proxied.subscribeKey.bind(proxied)
  proxied.subscribeKeys = proxied.subscribeKeys.bind(proxied)
  proxied.update = proxied.update.bind(proxied)
  proxied.set = proxied.set.bind(proxied)
  proxied.reset = proxied.reset.bind(proxied)
  proxied.persist = proxied.persist.bind(proxied)
  return proxied
}

/**
 * ValtioStore 基类（v3）
 *
 * 子类定义 state + getInitialState() + 业务方法（如 increment），通过静态方法创建/使用：
 * - createGlobal(initialState) → 全局单例，多组件共享
 * - createLocal(initialState) → 每次调用返回新实例
 * - use() / use(initialState) / use(globalStore) → React 统一入口，局部或全局
 *
 * 所有静态工厂均用 `this` 创建实例，保证 CounterStore.createGlobal() 得到 CounterStore 实例。
 */
class ValtioStore {
  [key: string]: unknown

  // ============================================
  // 核心创建方法
  // ============================================

  /**
   * 创建全局单例 Store，所有组件共享同一份状态。
   * 先 bindProxyMethods 再 devtools，避免 devtools 序列化时触发 "Please use proxy object"。
   */
  static createGlobal<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    options: CreateOptions = {
      devtools: true,
    },
  ): ValtioStore & T {
    const instance = new (this as typeof ValtioStore)()
    Object.assign(instance, initialState)
    const proxied = proxy(instance) as ValtioStore & T
    const bound = bindProxyMethods(proxied)

    if (process.env.NODE_ENV === 'development' && options.devtools !== false) {
      devtools(bound, {name: options.name ?? ValtioStore.name + ' (Global)'})
    }

    return bound
  }

  /**
   * 创建局部实例，每次调用都返回新的 proxy，适合单次使用或 createWithDerived 等内部用。
   */
  static createLocal<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    _options: CreateOptions = {},
  ): ValtioStore & T {
    const instance = new (this as typeof ValtioStore)()
    Object.assign(instance, initialState)
    return bindProxyMethods(proxy(instance) as ValtioStore & T)
  }

  /**
   * React Hook - 统一入口。
   * - use()、use(initialState)、use(() => state) → 局部 store，每组件独立，内部用 new this() 创建子类实例。
   * - use(globalStore) → 直接使用传入的 store（全局），通过 getSnapshot 存在判断是否为 store。
   */
  static use<T extends Record<string, unknown> = Record<string, unknown>>(
    initialStateOrStore?: InitialStateOrFn<T> | (ValtioStore & Record<string, unknown>),
  ): [Snapshot<ValtioStore & T>, ValtioStore & T] {
    const store = useMemo(() => {
      const arg = initialStateOrStore
      const isStore =
        arg && typeof arg === 'object' && typeof (arg as {getSnapshot?: unknown}).getSnapshot === 'function'
      if (isStore) return arg as ValtioStore & T
      const instance = new (this as typeof ValtioStore)()
      const initial = typeof arg === 'function' ? (arg as () => T)() : (arg ?? (instance.getInitialState() as T))
      Object.assign(instance, initial)
      return bindProxyMethods(proxy(instance) as ValtioStore & T)
    }, [])

    const snap = useSnapshot(store)
    return [snap, store]
  }

  /**
   * 向后兼容：create(initialState) 等价于 createGlobal(initialState)。
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
   * 创建带撤销/重做历史的 store（valtio-history），返回 { value, history, undo, redo } 形态。
   */
  static createWithHistory<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState: T = {} as T,
    options: Parameters<typeof proxyWithHistory>[1] = {},
  ) {
    const instance = new (this as typeof ValtioStore)()
    Object.assign(instance, initialState)
    return proxyWithHistory(instance, options)
  }

  /**
   * React Hook - 局部 store + 历史记录，返回 [snap, store]，snap 含 value / history，store 含 value、undo、redo。
   */
  static useLocalWithHistory<T extends Record<string, unknown> = Record<string, unknown>>(
    initialState?: InitialStateOrFn<T>,
    options: Parameters<typeof proxyWithHistory>[1] = {},
  ) {
    const store = useMemo(() => {
      const instance = new (this as typeof ValtioStore)()
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
   * 创建带派生状态的 store：base 为可写状态，derived 由 deriveFn(get) 计算，只读。
   * 返回 { base, derived }，通常配合 useSnapshot(base) / useSnapshot(derived) 使用。
   */
  static createWithDerived<TBase extends Record<string, unknown>, TDerived>(
    initialState: TBase,
    deriveFn: DeriveFn<ValtioStore & TBase, TDerived>,
  ) {
    const baseStore = (this as typeof ValtioStore).createLocal(initialState)
    const derivedState = derive(deriveFn, {proxy: baseStore})

    return {
      base: baseStore,
      derived: derivedState,
    }
  }

  /**
   * React Hook - 局部 store + 派生状态，返回 [baseSnap, baseStore, derivedSnap]，derived 由 deriveFn 根据 base 计算。
   */
  static useLocalWithDerived<TBase extends Record<string, unknown>, TDerived>(
    initialState: InitialStateOrFn<TBase> | undefined,
    deriveFn: DeriveFn<ValtioStore & TBase, TDerived>,
  ) {
    const config = useMemo(() => {
      const instance = new (this as typeof ValtioStore)()
      const initial =
        typeof initialState === 'function'
          ? (initialState as () => TBase)()
          : (initialState ?? (instance.getInitialState() as TBase))
      Object.assign(instance, initial)
      const baseStore = bindProxyMethods(proxy(instance) as ValtioStore & TBase)
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

    const instance = (this as typeof ValtioStore).createLocal(
      enhanced as Record<string, unknown>,
    ) as AsyncStoreWithMethods<T>

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

      const instance = new (this as typeof ValtioStore)()
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

      return bindProxyMethods(proxied)
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
