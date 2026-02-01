import {createStore} from '@empjs/valtio'

// 带历史的全局 store（用于本页 demo）
export const historyStore = createStore({count: 0}, {history: {}})

// 带派生的全局 store（用于本页 demo）
export const derivedStore = createStore(
  {a: 1, b: 2},
  {
    derive: (get, base) => {
      const s = get(base)
      return {sum: s.a + s.b}
    },
  },
)

// 异步请求用全局 store（用于本页 demo）：异步方法写在 store 内，this 指向 store
export const asyncStore = createStore(
  {
    user: null as {name: string} | null,
    loading: false,
    error: null as Error | null,
    loadUser() {
      this.loading = true
      this.error = null
      setTimeout(() => {
        this.user = {name: 'Alice'}
        this.loading = false
      }, 500)
    },
  },
  {name: 'AsyncStore'},
)
