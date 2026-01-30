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
import type {History} from 'valtio-history'
import {proxyWithHistory} from 'valtio-history'

// ============================================
// 类型定义
// ============================================

/** useWithHistory 返回的 snapshot 类型：value 为只读状态，history 含 index/nodes */
export interface WithHistorySnapshot<T extends Record<string, unknown>> {
  value: Snapshot<ValtioStore & T>
  history: History<ValtioStore & T>
  readonly isUndoEnabled: boolean
  readonly isRedoEnabled: boolean
  undo: () => void
  redo: () => void
}

/** createWithHistory / useWithHistory 返回的 store 类型（value 可写，含 undo/redo） */
export type StoreWithHistory<T extends Record<string, unknown>> = ReturnType<typeof proxyWithHistory<ValtioStore & T>>

/** 历史记录选项：在 valtio-history 基础上扩展 limit 等，业务传参无需类型声明 */
export type WithHistoryOptions = Parameters<typeof proxyWithHistory>[1] extends infer O
  ? O extends Record<string, unknown>
    ? O & {limit?: number}
    : {limit?: number}
  : {limit?: number}

/** 创建 Store 时的可选配置（如是否开启 devtools、显示名称） */
export interface CreateOptions {
  devtools?: boolean
  name?: string
}

/** 初始状态：可以是普通对象，或返回对象的函数（惰性初始化） */
export type InitialStateOrFn<T = Record<string, unknown>> = T | (() => T)

/** 派生函数：接收 get(proxy) 得到快照，返回派生出的新状态（如 total、count） */
export type DeriveFn<TProxy, TDerived> = (get: (proxy: TProxy) => Snapshot<TProxy>, proxy: TProxy) => TDerived

/** 异步 Store 的扩展状态：_loading[key]、_error[key] 用于表示某次 async 的加载中/错误 */
export interface AsyncStoreState<T = Record<string, unknown>> {
  _loading?: Record<string, boolean>
  _error?: Record<string, unknown>
  /**
   * 允许动态添加属性（如 async 方法生成的函数），使用 any 以避免业务代码中频繁转型
   */
  [key: string]: any
}

/** 带 async(key, fn) 方法的 Store：用于包装异步方法并自动维护 _loading/_error；callback 的 this 由库推断，业务无需声明 */
export interface AsyncStoreWithMethods<S extends ValtioStore = ValtioStore> extends ValtioStore, AsyncStoreState {
  async<K extends string>(
    key: K,
    asyncFn: (this: S, ...args: unknown[]) => Promise<unknown>,
  ): (...args: unknown[]) => Promise<unknown>
}

/** useAsync/createAsync 返回的 store：含 [key: string]: any 以便业务可挂载 store.async(key, fn) 的返回值并调用，无需类型声明 */
export type AsyncStoreInstance<S extends ValtioStore> = S & AsyncStoreWithMethods<S> & {[key: string]: any}

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
 * - create(initialState) → 每次调用返回新实例
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
  /**
   * 创建全局单例 Store，所有组件共享同一份状态。
   * 先 bindProxyMethods 再 devtools，避免 devtools 序列化时触发 "Please use proxy object"。
   */
  static createGlobal<S extends ValtioStore>(
    this: new () => S,
    initialState?: Partial<S>,
    options: CreateOptions = {
      devtools: true,
    },
  ): S {
    // biome-ignore lint/complexity/noThisInStatic: subclass ctor required (e.g. CounterStore)
    const instance = new (this as unknown as new () => S)()
    if (initialState) Object.assign(instance, initialState)
    const proxied = proxy(instance) as S
    const bound = bindProxyMethods(proxied)

    if (process.env.NODE_ENV === 'development' && options.devtools !== false) {
      devtools(bound, {name: options.name ?? instance.constructor.name + ' (Global)'})
    }

    return bound
  }

  /**
   * 创建局部实例，每次调用都返回新的 proxy，适合单次使用或 createWithDerived 等内部用。
   */
  static create<S extends ValtioStore>(this: new () => S, initialState?: Partial<S>, _options: CreateOptions = {}): S {
    // biome-ignore lint/complexity/noThisInStatic: subclass ctor required
    const instance = new (this as unknown as new () => S)()
    if (initialState) Object.assign(instance, initialState)
    const proxied = proxy(instance) as S
    return bindProxyMethods(proxied)
  }

  /**
   * React Hook - 统一入口。
   * - use()、use(initialState)、use(() => state) → 局部 store，每组件独立，内部用 new this() 创建子类实例。
   * - use(globalStore) → 直接使用传入的 store（全局），通过 getSnapshot 存在判断是否为 store。
   */
  static use<S extends ValtioStore>(
    this: new () => S,
    initialStateOrStore?: InitialStateOrFn<Partial<S>> | S,
  ): [Snapshot<S>, S] {
    const store = useMemo(() => {
      const arg = initialStateOrStore
      const isStore =
        arg && typeof arg === 'object' && typeof (arg as {getSnapshot?: unknown}).getSnapshot === 'function'
      if (isStore) return arg as S
      // biome-ignore lint/complexity/noThisInStatic: subclass ctor required (e.g. CounterStore)
      const instance = new (this as unknown as new () => S)()
      const initial =
        typeof arg === 'function' ? (arg as () => Partial<S>)() : (arg ?? (instance.getInitialState() as Partial<S>))
      Object.assign(instance, initial)
      return bindProxyMethods(proxy(instance) as S)
    }, [])

    const snap = useSnapshot(store) as Snapshot<S>
    return [snap, store]
  }

  // ============================================
  // 带特性的工厂方法
  // ============================================

  /**
   * 创建带撤销/重做历史的 store（valtio-history），返回 { value, history, undo, redo } 形态。
   */
  static createWithHistory<S extends ValtioStore>(
    this: new () => S,
    initialState?: Partial<S>,
    options: WithHistoryOptions = {},
  ): StoreWithHistory<S> {
    // biome-ignore lint/complexity/noThisInStatic: subclass ctor required
    const instance = new (this as unknown as new () => S)()
    if (initialState) Object.assign(instance, initialState)
    return proxyWithHistory(
      instance,
      options as Parameters<typeof proxyWithHistory>[1],
    ) as unknown as StoreWithHistory<S>
  }

  /**
   * React Hook - 局部 store + 历史记录，返回 [snap, store]，snap 含 value / history，store 含 value、undo、redo。
   */
  static useWithHistory<S extends ValtioStore>(
    this: new () => S,
    initialState?: InitialStateOrFn<Partial<S>>,
    options: WithHistoryOptions = {},
  ): [WithHistorySnapshot<S>, StoreWithHistory<S>] {
    const store = useMemo(() => {
      // biome-ignore lint/complexity/noThisInStatic: subclass ctor required
      const instance = new (this as unknown as new () => S)()
      const initial =
        typeof initialState === 'function'
          ? (initialState as () => Partial<S>)()
          : (initialState ?? (instance.getInitialState() as Partial<S>))
      Object.assign(instance, initial)
      return proxyWithHistory(
        instance,
        options as Parameters<typeof proxyWithHistory>[1],
      ) as unknown as StoreWithHistory<S>
    }, [])

    const snap = useSnapshot(store) as unknown as WithHistorySnapshot<S>
    return [snap, store]
  }

  /**
   * 创建带派生状态的 store：base 为可写状态，derived 由 deriveFn(get) 计算，只读。
   * 返回 { base, derived }，通常配合 useSnapshot(base) / useSnapshot(derived) 使用。
   */
  static createWithDerived<S extends ValtioStore, TDerived>(
    this: new () => S,
    initialState: Partial<S>,
    deriveFn: DeriveFn<S, TDerived>,
  ) {
    // biome-ignore lint/complexity/noThisInStatic: intentional: subclass ctor for create()
    const baseStore = (this as any).create(initialState) as S
    type GetSnapshot = (store: S) => Snapshot<S>
    const derivedState = derive((get: GetSnapshot) => deriveFn(get, baseStore), {proxy: baseStore})

    return {
      base: baseStore,
      derived: derivedState,
    }
  }

  /**
   * React Hook - 局部 store + 派生状态，返回 [baseSnap, baseStore, derivedSnap]，derived 由 deriveFn 根据 base 计算。
   */
  static useWithDerived<S extends ValtioStore, TDerived>(
    this: new () => S,
    initialState: InitialStateOrFn<Partial<S>> | undefined,
    deriveFn: DeriveFn<S, TDerived>,
  ) {
    const config = useMemo(() => {
      // biome-ignore lint/complexity/noThisInStatic: subclass ctor required
      const instance = new (this as unknown as new () => S)()
      const initial =
        typeof initialState === 'function'
          ? (initialState as () => Partial<S>)()
          : (initialState ?? (instance.getInitialState() as Partial<S>))
      Object.assign(instance, initial)
      const baseStore = bindProxyMethods(proxy(instance) as S)
      const derivedState = derive(deriveFn, {proxy: baseStore})

      return {base: baseStore, derived: derivedState}
    }, [])

    const baseSnap = useSnapshot(config.base) as Snapshot<S>
    const derivedSnap = useSnapshot(config.derived)

    return [baseSnap, config.base, derivedSnap] as [Snapshot<S>, S, TDerived]
  }

  /**
   * 创建可代理的 Map（valtio proxyMap），键值变化可被订阅。
   */
  static createMap<T = unknown>(entries?: Iterable<[string, T]> | null): Map<string, T> {
    return proxyMap(entries ?? []) as Map<string, T>
  }

  /**
   * 创建可代理的 Set（valtio proxySet），增删可被订阅。
   */
  static createSet<T = unknown>(values?: Iterable<T> | null): Set<T> {
    return proxySet(values ?? [])
  }

  // ============================================
  // 实例方法
  // ============================================

  /** 获取当前状态的只读快照，用于序列化或只读消费。 */
  getSnapshot(): Snapshot<this> {
    return snapshot(this) as Snapshot<this>
  }

  /** 订阅整个 store 的任意变化，返回取消订阅函数。 */
  subscribe(callback: () => void, notifyInSync = false): Unsubscribe {
    return subscribe(this, callback, notifyInSync)
  }

  /** 只订阅单个 key 的变化，减少无效触发。 */
  subscribeKey(key: string, callback: (value: unknown) => void): Unsubscribe {
    return subscribeKey(this, key, callback)
  }

  /** 订阅多个 key，任一变化即回调 (key, value)。 */
  subscribeKeys(keys: string[], callback: (key: string, value: unknown) => void): Unsubscribe {
    const unsubscribers = keys.map(k => subscribeKey(this, k, value => callback(k, value)))
    return () => unsubscribers.forEach(unsub => unsub())
  }

  /** 批量更新多个字段。 */
  update(updates: Record<string, unknown>): void {
    Object.assign(this, updates)
  }

  /** 设置单个字段。 */
  set(key: string, value: unknown): void {
    this[key] = value
  }

  /** 按路径设置嵌套字段，如 setNested('a.b.c', 1)。 */
  setNested(path: string, value: unknown): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce(
      (obj: Record<string, unknown>, k: string) => obj[k] as Record<string, unknown>,
      this as unknown as Record<string, unknown>,
    ) as any
    target[lastKey] = value
  }

  /** 删除单个 key。 */
  delete(key: string): void {
    delete this[key]
  }

  /** 重置为 getInitialState() 的初始值，仅清数据字段，保留方法。 */
  reset(): void {
    const initial = this.getInitialState() as Record<string, unknown>
    for (const key of Object.keys(this)) {
      if (typeof this[key] !== 'function') {
        delete this[key]
      }
    }
    Object.assign(this, initial)
  }

  /** 将 value 标记为 ref，大对象不参与代理，减少内存与订阅粒度。 */
  ref<T>(value: T): T {
    return ref(value as object) as T
  }

  /** 批量更新时包一层，便于调试或与外部批量逻辑对齐。 */
  batch(fn: (store: this) => void): void {
    fn(this)
  }

  /** 深拷贝当前快照并生成新的 store 实例（同子类）。 */
  clone(): this {
    const snap = this.getSnapshot()
    const cloned = JSON.parse(JSON.stringify(snap)) as Record<string, unknown>
    return (this.constructor as any).create(cloned) as this
  }

  /** 转为纯数据对象（去掉方法），供 JSON.stringify 或持久化使用；实际调用处多用 bindProxyMethods 重写版。 */
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

  /** 从纯数据对象写回 store。 */
  fromJSON(json: Record<string, unknown>): void {
    this.update(json)
  }

  /**
   * 持久化到 localStorage：先尝试读取 key 并 fromJSON 恢复，再订阅变化并 toJSON 写入。
   * 返回取消订阅函数。
   */
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

  /** 开发时打印当前快照到控制台。 */
  debug(label = 'Store State'): void {
    console.group(label)
    console.log(this.getSnapshot())
    console.groupEnd()
  }

  /** 子类覆盖：返回初始状态，用于 reset、use(undefined) 等。 */
  getInitialState(): Record<string, unknown> {
    return {}
  }

  // ============================================
  // 高级模式
  // ============================================

  /**
   * 创建带 _loading / _error 的异步 Store，并挂载 async(key, asyncFn) 方法。
   * 调用 store.async('fetchUser', fn) 会返回一个包装函数，执行时自动设 _loading[key]、_error[key]。
   */
  static createAsync<S extends ValtioStore>(this: new () => S, initialState?: Partial<S>): AsyncStoreInstance<S> {
    const enhanced: AsyncStoreState = {
      ...initialState,
      _loading: {},
      _error: {},
    }

    // Must use subclass constructor (e.g. UserStore), not ValtioStore — otherwise instance has no subclass methods
    // biome-ignore lint/complexity/noThisInStatic: intentional: this is the subclass ctor for create()
    const instance = (this as any).create(enhanced as unknown as Record<string, unknown>) as AsyncStoreInstance<S>

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

  /**
   * React Hook - 局部异步 Store，用法同 createAsync，适合组件内独立请求（如按 id 拉用户）。
   */
  static useAsync<S extends ValtioStore>(
    this: new () => S,
    initialState?: InitialStateOrFn<Partial<S>>,
  ): [Snapshot<AsyncStoreInstance<S>>, AsyncStoreInstance<S>] {
    const store = useMemo(() => {
      const initial =
        typeof initialState === 'function' ? (initialState as () => Partial<S>)() : ((initialState ?? {}) as Partial<S>)

      const enhanced: AsyncStoreState = {
        ...initial,
        _loading: {},
        _error: {},
      }

      // biome-ignore lint/complexity/noThisInStatic: subclass ctor required (e.g. UserStore)
      const instance = new (this as unknown as new () => S)()
      Object.assign(instance, enhanced)
      const proxied = proxy(instance) as AsyncStoreInstance<S>

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

// ============================================
// 导出 Valtio 相关工具，供高级用法或混用
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
