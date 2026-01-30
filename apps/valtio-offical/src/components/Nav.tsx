import {createContext, useContext} from 'react'
import {Link, useLocation} from 'wouter'

export const ThemeContext = createContext<{isDark: boolean; onToggleTheme: () => void} | null>(null)
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

const GITHUB_URL = 'https://github.com/empjs/valtio-best-practices'

const links = [
  {href: '/', label: '首页'},
  {href: '/create-store', label: '创建 Store'},
  {href: '/use-store', label: '使用 Store'},
  {href: '/collections', label: '集合'},
  {href: '/subscribe', label: '订阅'},
  {href: '/performance', label: '性能'},
] as const

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

const iconBtnClass =
  'inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5FF] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-900'

export function Nav() {
  const [location] = useLocation()
  const {isDark, onToggleTheme} = useTheme()

  return (
    <nav
      className="sticky top-0 z-10 mx-4 mt-4 rounded-xl border border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95"
      aria-label="主导航"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="cursor-pointer rounded-lg px-2 py-2 text-sm font-semibold text-[#4C1D95] transition-colors duration-200 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5FF] dark:text-violet-200 dark:hover:text-violet-100 dark:focus-visible:ring-offset-slate-900"
          >
            Valtio Enhanced
          </Link>
          <span className="hidden text-gray-300 dark:text-slate-600 sm:inline" aria-hidden>
            |
          </span>
          {links.map(({href, label}) => {
            const isActive = location === href
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF5FF] dark:focus-visible:ring-offset-slate-900 ${
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
        <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2 dark:border-slate-600 sm:gap-1 sm:pl-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconBtnClass}
            aria-label={isDark ? '切换到浅色' : '切换到深色'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtnClass}
            aria-label="在 GitHub 上查看"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </nav>
  )
}
