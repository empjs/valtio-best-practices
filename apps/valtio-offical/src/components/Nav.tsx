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
      className="sticky top-0 z-10 mx-4 mt-4 rounded-xl border border-violet-200/60 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/90"
      aria-label="主导航"
    >
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
        {links.map(({ href, label }) => {
          const isActive = location === href
          return (
            <Link
              key={href}
              href={href}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5FF] dark:focus-visible:ring-offset-slate-900 ${
                isActive
                  ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200'
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
