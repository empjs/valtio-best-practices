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

/** 与原生 Valtio 相比的核心优势，按权重从高到低：核心价值 > 采用门槛 > 生产力 > 差异化 > 场景扩展 > 支撑能力 */
const advantages = [
  {
    title: '极大减少样板代码',
    desc: '无需每次手动 proxy + useSnapshot + subscribe，store 直接拥有 set、update、reset、persist 等实用方法',
  },
  {
    title: '一流 TypeScript 支持',
    desc: '三种模式（普通 / 历史 / 派生）返回类型精确推导，几乎零 as 断言',
  },
  {
    title: '一行代码派生状态',
    desc: '通过 derive 选项自动生成响应式计算属性',
  },
  {
    title: '内置完整撤销/重做',
    desc: 'useSnapshot 直接返回 undo、redo、isUndoEnabled 等控制',
  },
  {
    title: '持久化只需一行',
    desc: "store.persist('key') 自动双向同步 localStorage",
  },
  {
    title: '组件内局部状态',
    desc: 'useStore Hook 支持 history / derive 模式，非常适合表单、编辑器、画板等场景',
  },
  {
    title: '实用工具齐全',
    desc: '深层路径更新、多键订阅、深克隆、智能 JSON 序列化、调试输出等',
  },
  {
    title: '开发友好',
    desc: '自动开启 DevTools，内置 createMap / createSet 集合代理',
  },
] as const

export function Home() {
  const [installTab, setInstallTab] = useState<InstallLabel>('pnpm')
  const activeCmd = installCommands.find(c => c.label === installTab)!

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Hero：官网风格 — 渐变色 + 大字号、多留白、单一 CTA */}
      <header className="mb-20 border-b border-gray-200/80 pb-14 dark:border-slate-700">
        <h1 className="mb-4 bg-gradient-to-r from-[#4C1D95] via-violet-700 to-violet-600 bg-clip-text text-3xl font-semibold tracking-tight text-transparent dark:from-violet-200 dark:via-violet-100 dark:to-violet-300 sm:text-4xl">
          Valtio Enhanced Store
        </h1>
        <p className="mb-4 text-lg font-medium text-slate-700 dark:text-slate-200">
          Valtio 的强大增强版 —— 更少样板代码，更高生产力
        </p>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          基于 Valtio
          的细粒度响应式机制，提供开箱即用的高级功能：历史回溯、自动派生、持久化、嵌套更新、克隆、重置等，让状态管理体验更接近
          Zustand / Pinia，但完全保留 Valtio 的轻量与快照优势。
        </p>
        <a
          href="#quick-start-heading"
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5FF] dark:focus-visible:ring-offset-slate-900"
        >
          快速上手
        </a>
      </header>

      <section className="mb-12 sm:mb-16" aria-labelledby="quick-start-heading">
        <h2 id="quick-start-heading" className="mb-2 text-xl font-medium text-slate-800 dark:text-slate-200">
          快速上手
        </h2>
        <h3 id="install-heading" className="mb-1.5 text-base font-medium text-slate-700 dark:text-slate-300">
          安装
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          依赖 React 18+，与 valtio、derive-valtio、valtio-history 一起使用。选择你的包管理器：
        </p>
        <div className="rounded-2xl border border-gray-200/90 bg-white/95 shadow-md shadow-violet-100/40 dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/50">
          <div
            role="tablist"
            aria-label="包管理器"
            className="flex flex-wrap gap-0 border-b border-gray-200 dark:border-slate-600"
          >
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
                  className={`cursor-pointer rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
                    isActive
                      ? 'border-violet-500 bg-violet-50 text-violet-800 dark:border-violet-400 dark:bg-violet-900/40 dark:text-violet-200'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
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
            className="p-4"
          >
            <code className="block rounded-lg border border-gray-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
              {activeCmd.cmd}
            </code>
          </div>
        </div>
      </section>

      <section className="mb-12 sm:mb-16" aria-labelledby="advantages-heading">
        <h2 id="advantages-heading" className="mb-4 text-xl font-medium text-slate-800 dark:text-slate-200">
          与原生 Valtio 相比的核心优势
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {advantages.map(({title, desc}) => (
            <li
              key={title}
              className="rounded-2xl border border-gray-200/90 bg-white/95 p-4 shadow-md shadow-violet-100/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100/60 dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/50 dark:hover:shadow-slate-800/60"
            >
              <h3 className="mb-1.5 font-medium text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="docs-nav-heading">
        <h2 id="docs-nav-heading" className="mb-4 text-xl font-medium text-slate-800 dark:text-slate-200">
          用法导航
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({href, title, desc}) => (
            <li key={href}>
              <Link
                href={href}
                className="block cursor-pointer rounded-2xl border border-gray-200/90 bg-white/95 p-5 shadow-md shadow-violet-100/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5FF] dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/50 dark:hover:border-slate-500 dark:hover:shadow-slate-800/60 dark:focus-visible:ring-offset-slate-900"
              >
                <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
