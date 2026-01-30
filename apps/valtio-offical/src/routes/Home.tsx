import {Link} from 'wouter'

const installCommands = [
  {cmd: 'pnpm add @empjs/valtio', label: 'pnpm'},
  {cmd: 'npm install @empjs/valtio', label: 'npm'},
  {cmd: 'bun add @empjs/valtio', label: 'bun'},
  {cmd: 'yarn add @empjs/valtio', label: 'yarn'},
] as const

const cards = [
  {href: '/create-store', title: 'createStore', desc: '全局 store：常规 / history / derive，store.useSnapshot()'},
  {href: '/use-store', title: 'useStore', desc: '局部 store：[snap, store]，支持 history / derive / 异步'},
  {href: '/collections', title: 'collections', desc: 'createMap / createSet'},
  {href: '/subscribe', title: 'subscribe', desc: 'subscribeKey、subscribeKeys、batch、细粒度订阅'},
  {href: '/performance', title: 'performance', desc: '长列表：batch 批量操作、content-visibility'},
] as const

const advantages = [
  {title: '统一入口', desc: 'createStore / useStore 通过 options 支持 history、derive，无需 createStoreWithHistory 等分散 API'},
  {title: '推荐用法一致', desc: '全局、带历史、带派生均用 store.useSnapshot() 读快照，写法统一'},
  {title: '异步即普通 store', desc: '无专用 asyncStore，在 store 内写 loadUser() 等方法，手动 loading/error，更可控'},
  {title: '基于 valtio', desc: '复用 proxy、useSnapshot、derive-valtio、valtio-history，增强方法集与类型推导'},
] as const

export function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">@empjs/valtio 用法示例</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        以「如何用」API 为主：导入、签名、带注释的示例代码、何时用全局/局部。点击下方卡片进入对应用法页。
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-medium text-slate-800 dark:text-slate-200">安装</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          依赖 React 18+，与 valtio、derive-valtio、valtio-history 一起使用。
        </p>
        <ul className="space-y-2">
          {installCommands.map(({cmd, label}) => (
            <li key={label} className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {label}
              </span>
              <code className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                {cmd}
              </code>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-medium text-slate-800 dark:text-slate-200">与 valtio 对比的核心优势</h2>
        <ul className="space-y-3">
          {advantages.map(({title, desc}) => (
            <li
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-1 font-medium text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-200">用法导航</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({href, title, desc}) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
