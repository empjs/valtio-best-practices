/**
 * 示例 1: 全局主题管理
 * 与 Tailwind v4 dark 变体联动：切换主题时在 document.documentElement 上增删 .dark，全页 dark: 样式生效
 */

import {createStore} from '@empjs/valtio'
import {useEffect} from 'react'

const themeStore = createStore(
  {
    theme: 'light' as 'light' | 'dark',
    fontSize: 16,

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },

    increaseFontSize() {
      this.fontSize = Math.min(this.fontSize + 2, 24)
    },

    decreaseFontSize() {
      this.fontSize = Math.max(this.fontSize - 2, 12)
    },
  },
  {devtools: true, name: 'Theme'},
)

themeStore.persist('theme-settings')

/** 根据当前 theme 同步到 DOM，供 Tailwind dark: 使用 */
function syncThemeToDom(theme: 'light' | 'dark') {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeToggle() {
  const snap = themeStore.useSnapshot()
  const isDark = snap.theme === 'dark'

  useEffect(() => {
    syncThemeToDom(snap.theme)
  }, [snap.theme])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">主题与字体</h2>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => themeStore.toggleTheme()}
          className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-500 dark:hover:bg-slate-600"
        >
          切换到 {isDark ? 'light' : 'dark'} 模式
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-700">
          <button
            type="button"
            onClick={() => themeStore.decreaseFontSize()}
            className="rounded bg-slate-200 px-2 py-1 text-sm font-medium hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            A-
          </button>
          <span className="min-w-28 text-center text-sm" style={{fontSize: snap.fontSize}}>
            字体: {snap.fontSize}px
          </span>
          <button
            type="button"
            onClick={() => themeStore.increaseFontSize()}
            className="rounded bg-slate-200 px-2 py-1 text-sm font-medium hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            A+
          </button>
        </div>
      </div>
    </section>
  )
}
