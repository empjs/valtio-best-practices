import type {ReactNode} from 'react'
import {useState} from 'react'
import {Link} from 'wouter'

const installCommands = [
  {cmd: 'pnpm add @empjs/valtio', label: 'pnpm'},
  {cmd: 'npm install @empjs/valtio', label: 'npm'},
  {cmd: 'bun add @empjs/valtio', label: 'bun'},
  {cmd: 'yarn add @empjs/valtio', label: 'yarn'},
] as const

type InstallLabel = (typeof installCommands)[number]['label']

const cards = [
  {href: '/create-store', title: 'createStore', desc: '全局 store：常规 / history / derive，store.useSnapshot()'},
  {href: '/use-store', title: 'useStore', desc: '局部 store：[snap, store]，支持 history / derive / 异步'},
  {href: '/collections', title: 'collections', desc: 'createMap / createSet'},
  {href: '/subscribe', title: 'subscribe', desc: 'subscribeKey、subscribeKeys、batch、细粒度订阅'},
  {href: '/performance', title: 'performance', desc: '长列表：batch 批量操作、content-visibility'},
] as const

/** 与原生 Valtio 相比的核心优势 */
const advantages: Array<{
  title: string
  desc: string
  icon: (className: string) => ReactNode
}> = [
  {
    title: '极大减少样板代码',
    desc: '无需每次手动 proxy + useSnapshot + subscribe，store 直接拥有 set、update、reset、persist 等实用方法',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
  },
  {
    title: '一流 TypeScript 支持',
    desc: '三种模式（普通 / 历史 / 派生）返回类型精确推导，几乎零 as 断言',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: '一行代码派生状态',
    desc: '通过 derive 选项自动生成响应式计算属性',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    ),
  },
  {
    title: '内置完整撤销/重做',
    desc: 'useSnapshot 直接返回 undo、redo、isUndoEnabled 等控制',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 10h10a5 5 0 015 5v2M3 14h10a5 5 0 005-5v-2M21 10l-2 2 2 2M21 14l-2-2 2-2" />
      </svg>
    ),
  },
  {
    title: '持久化只需一行',
    desc: "store.persist('key') 自动双向同步 localStorage",
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: '组件内局部状态',
    desc: 'useStore Hook 支持 history / derive 模式，非常适合表单、编辑器、画板等场景',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: '实用工具齐全',
    desc: '深层路径更新、多键订阅、深克隆、智能 JSON 序列化、调试输出等',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: '开发友好',
    desc: '自动开启 DevTools，内置 createMap / createSet 集合代理',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      </svg>
    ),
  },
]

/** 用法导航卡片：带 logo、hover 高亮与描边 */
const docCardIcons: Record<string, (cls: string) => ReactNode> = {
  'create-store': cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
  'use-store': cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
  collections: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2zM7 11V7a2 2 0 012-2h6a2 2 0 012 2v4" />
    </svg>
  ),
  subscribe: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  performance: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
    </svg>
  ),
}

export function Home() {
  const [installTab, setInstallTab] = useState<InstallLabel>('pnpm')
  const [copied, setCopied] = useState(false)
  const activeCmd = installCommands.find(c => c.label === installTab)!

  const handleCopyInstall = async () => {
    const text = activeCmd.cmd
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 pt-4 pb-8 sm:pt-6 sm:pb-12">
      {/* 首页背景：蓝橙虚化色块 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-400/30 blur-[100px] dark:bg-blue-500/20 dark:blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-orange-400/30 blur-[100px] dark:bg-orange-500/20 dark:blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-300/20 blur-[80px] dark:bg-blue-400/15 dark:blur-[100px]" />
      </div>
      {/* 标题区：蓝橙高斯模糊背景 + 蓝橙渐变底 + 标题蓝橙渐变字 */}
      <header className="relative mb-10 mt-10 overflow-hidden rounded-2xl text-center">
        {/* 蓝橙浮动模糊背景（参考 UI UX Pro Max：primary/accent + blur-3xl + animate-float） */}
        <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl animate-float dark:bg-blue-500/25" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl animate-float dark:bg-orange-500/15" />
        </div>
        <div className="header-overlay-gradient" aria-hidden />
        <div className="relative px-6 py-10 sm:py-12">
          <h1 className="mx-auto mb-4 max-w-4xl text-center text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="hero-gradient-text">
              Valtio Enhanced Store
            </span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg font-medium text-slate-800 dark:text-slate-200">
            Valtio 的强大增强版 —— 更少样板代码，更高生产力
          </p>
          {/* <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          基于 Valtio
          的细粒度响应式机制，提供开箱即用的高级功能：历史回溯、自动派生、持久化、嵌套更新、克隆、重置等，让状态管理体验更接近
          Zustand / Pinia，但完全保留 Valtio 的轻量与快照优势。
        </p> */}

          <p className="mx-auto mb-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            依赖 React 18+，与 valtio、derive-valtio、valtio-history 一起使用。
          </p>
          <div className="mx-auto max-w-2xl rounded-xl border border-slate-400/50 bg-slate-200/80 p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80 sm:p-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div role="tablist" aria-label="包管理器" className="flex shrink-0 flex-wrap gap-1 sm:gap-2">
              {installCommands.map(({label}) => {
                const isActive = installTab === label
                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`install-panel-${label}`}
                    id={`install-tab-${label}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setInstallTab(label)}
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                      isActive
                        ? 'border-slate-500 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100'
                        : 'border-slate-500/50 bg-transparent text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <div
              role="tabpanel"
              id={`install-panel-${activeCmd.label}`}
              aria-labelledby={`install-tab-${activeCmd.label}`}
              className="relative min-w-0 flex-1"
            >
              <code className="block rounded-lg border border-slate-600/50 bg-slate-900/80 px-3 py-2 pr-12 font-mono text-sm text-slate-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
                {activeCmd.cmd}
              </code>
              <button
                type="button"
                onClick={handleCopyInstall}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors duration-200 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 dark:text-slate-400 dark:hover:text-orange-300"
                aria-label={copied ? '已复制' : '复制命令'}
              >
                {copied ? (
                  <svg
                    className="h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative mb-12 sm:mb-16 text-center" aria-labelledby="advantages-heading">
        {/* 顶部渐变装饰线 */}

        <h2 id="advantages-heading" className="mx-auto mb-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
          <span className="text-slate-600 dark:text-slate-300">与原生 </span>
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-orange-400">
            Valtio
          </span>
          <span className="text-slate-600 dark:text-slate-300"> 相比的核心优势</span>
        </h2>
        <p className="mx-auto mb-2 max-w-xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          更少样板、更强类型、内置历史与派生，开箱即用
        </p>
        {/* 副标题下渐变线 */}
        <div
          className="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"
          aria-hidden
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map(({title, desc, icon}) => (
            <li key={title} className="flex">
              <div className="group relative flex h-full w-full flex-row items-start gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-5 text-left shadow-md shadow-slate-200/50 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-200/20 hover:ring-2 hover:ring-blue-400/30 hover:ring-offset-2 hover:ring-offset-white dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/50 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/90 dark:hover:shadow-xl dark:hover:shadow-blue-900/20 dark:hover:ring-blue-400/30 dark:ring-offset-slate-900">
                {/* 卡片左上角渐变光晕 */}
                <span
                  className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-orange-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/30 dark:to-orange-500/30"
                  aria-hidden
                />
                <span
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-600 dark:to-slate-700"
                  aria-hidden
                >
                  {icon('h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200')}
                </span>
                <div className="relative min-w-0 flex-1 text-left">
                  <h3 className="mb-1 font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                    {title}
                  </h3>
                  <p className="min-h-[2.5rem] text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative text-center" aria-labelledby="docs-nav-heading">
        {/* 顶部渐变装饰线 */}
        <div className="mx-auto mb-6 h-1 w-24 rounded-full" aria-hidden />
        <h2 id="docs-nav-heading" className="mx-auto mb-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
          <span className="text-slate-600 dark:text-slate-300">核心</span>
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-orange-400">
            用法一览
          </span>
        </h2>
        <p className="mx-auto mb-2 max-w-xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          createStore · useStore · collections · subscribe · performance —— 一点即达，即查即用
        </p>
        {/* 副标题下渐变线 */}
        <div
          className="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"
          aria-hidden
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({href, title, desc}) => {
            const slug = href.slice(1) || 'create-store'
            const Icon = docCardIcons[slug] ?? docCardIcons['create-store']
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className="group relative flex h-full w-full flex-row cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-md shadow-slate-200/50 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-200/20 hover:ring-2 hover:ring-blue-400/30 hover:ring-offset-2 hover:ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/50 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/90 dark:hover:shadow-xl dark:hover:shadow-blue-900/20 dark:hover:ring-blue-400/30 dark:focus-visible:ring-offset-slate-900"
                >
                  {/* 卡片左上角渐变光晕 */}
                  <span
                    className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-orange-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/30 dark:to-orange-500/30"
                    aria-hidden
                  />
                  <span
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-600 dark:to-slate-700"
                    aria-hidden
                  >
                    {Icon('h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200')}
                  </span>
                  <div className="relative min-w-0 flex-1 text-left">
                    <h3 className="mb-1 font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                      {title}
                    </h3>
                    <p className="min-h-[2.5rem] text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
