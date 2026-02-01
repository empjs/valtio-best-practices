import {version} from '@empjs/valtio'
import {createContext, useContext} from 'react'
import {Link, useLocation} from 'wouter'
import {useT} from '../i18n'
import type {Locale} from '../i18n/translations'
import {localeStore} from '../stores/localeStore'

export const ThemeContext = createContext<{isDark: boolean; onToggleTheme: () => void} | null>(null)
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

const GITHUB_URL = 'https://github.com/empjs/valtio-best-practices'

const links: Array<{href: string; labelKey: string}> = [
  {href: '/', labelKey: 'nav.home'},
  {href: '/use', labelKey: 'nav.createStore'},
  {href: '/collections', labelKey: 'nav.collections'},
  {href: '/subscribe', labelKey: 'nav.subscribe'},
  {href: '/performance', labelKey: 'nav.performance'},
]

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
  'inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-900'

export function Nav() {
  const [location] = useLocation()
  const {isDark, onToggleTheme} = useTheme()
  const t = useT()
  const snap = localeStore.useSnapshot()

  const toggleLocale = () => {
    localeStore.set('locale', (snap.locale === 'zh' ? 'en' : 'zh') as Locale)
  }

  return (
    <nav
      className="sticky top-0 z-10 mx-4 mt-4 rounded-xl border border-white/30 bg-white/45 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:border-white/15 dark:bg-slate-900/45 dark:shadow-slate-900/50"
      aria-label="主导航"
    >
      <div className="flex flex-wrap items-center justify-between top-4 gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="relative cursor-pointer rounded-lg px-2 py-2 text-sm font-semibold text-slate-800 transition-colors duration-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-100 dark:hover:text-slate-200 dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-900"
          >
            @empjs/valtio
            <span className="absolute top-[-2px] right-0 hidden text-[9px] font-bold text-slate-400 dark:text-slate-500 sm:inline-block">
              v{version}
            </span>
          </Link>
          <span className="hidden text-gray-300 dark:text-slate-600 sm:inline" aria-hidden>
            |
          </span>
          {links.map(({href, labelKey}) => {
            const isActive = location === href
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-900 ${
                  isActive
                    ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                {t(labelKey)}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2 dark:border-slate-600 sm:gap-1 sm:pl-3">
          <button
            type="button"
            onClick={toggleLocale}
            className={iconBtnClass}
            aria-label={t('nav.langSwitch')}
            title={t('nav.langSwitch')}
          >
            <span className="text-sm font-medium">{snap.locale === 'zh' ? 'EN' : '中'}</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconBtnClass}
            aria-label={isDark ? t('nav.themeToLight') : t('nav.themeToDark')}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtnClass}
            aria-label={t('nav.github')}
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </nav>
  )
}
