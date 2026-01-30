import {Link} from 'wouter'

const cards = [
  {href: '/create-store', title: 'createStore', desc: '全局 store：创建、useSnapshot、set/update'},
  {href: '/use-store', title: 'useStore', desc: '局部 store：组件内 [snap, store]'},
  {href: '/with-history', title: 'withHistory', desc: '带撤销/重做的 store'},
  {href: '/with-derived', title: 'withDerived', desc: '派生状态：base + derived'},
  {href: '/async-store', title: 'asyncStore', desc: '异步：store.async、_loading/_error'},
  {href: '/collections', title: 'collections', desc: 'createMap / createSet'},
  {href: '/performance', title: 'performance', desc: 'subscribeKey、batch、细粒度订阅'},
] as const

export function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">@empjs/valtio 用法示例</h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        以「如何用」API 为主：导入、签名、带注释的示例代码、何时用全局/局部。点击下方卡片进入对应用法页。
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({href, title, desc}) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
