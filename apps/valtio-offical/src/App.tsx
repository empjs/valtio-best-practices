import {useEffect, useState} from 'react'
import {Route, Switch} from 'wouter'
import {Nav, ThemeContext} from './components/Nav'
import {useT} from './i18n'
import {Collections, Home, Performance, Subscribe, Use} from './routes/index'

const THEME_KEY = 'valtio-theme'

function readTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
  if (saved === 'light' || saved === 'dark') return saved
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)
  const t = useT()
  const isDark = theme === 'dark'

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const themeValue = {isDark, onToggleTheme: toggleTheme}

  return (
    <ThemeContext.Provider value={themeValue}>
      <div
        className={`min-h-screen transition-colors duration-200 dark:text-slate-100 ${isDark ? 'dark' : ''} ${
          isDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800'
            : 'bg-gradient-to-b from-slate-50 to-white'
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-slate-400 dark:focus:bg-slate-800 dark:focus:ring-slate-500"
        >
          {t('app.skipToMain')}
        </a>
        <Nav />
        <main id="main">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/use" component={Use} />
            <Route path="/collections" component={Collections} />
            <Route path="/subscribe" component={Subscribe} />
            <Route path="/performance" component={Performance} />
          </Switch>
        </main>
        <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="mb-2 flex justify-center gap-4">
            <a
              href="https://skill.empjs.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              Nova Skill
            </a>
            <a
              href="https://empjs.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              EMPJS
            </a>
          </div>
          {t('app.footer')}
        </footer>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
