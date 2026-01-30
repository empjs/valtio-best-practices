import {Link, useLocation} from 'wouter'

const links = [
  { href: '/', label: '首页' },
  { href: '/create-store', label: '创建 Store' },
  { href: '/use-store', label: '使用 Store' },
  { href: '/collections', label: '集合' },
  { href: '/subscribe', label: '订阅' },
  { href: '/performance', label: '性能' },
] as const

export function Nav() {
  const [location] = useLocation()

  return (
    <nav
      className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80"
      aria-label="主导航"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        {links.map(({ href, label }) => {
          const isActive = location === href
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-900 ${
                isActive
                  ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
