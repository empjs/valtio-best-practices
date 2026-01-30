import {useEffect, useState} from 'react'
import {Route, Switch} from 'wouter'
import {Nav, ThemeContext} from './components/Nav'
import {Collections, CreateStore, Home, Performance, Subscribe, UseStore} from './routes/index'

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
  const isDark = theme === 'dark'

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  const themeValue = {isDark, onToggleTheme: toggleTheme}

  return (
    <ThemeContext.Provider value={themeValue}>
      <div
        className={`min-h-screen transition-colors dark:text-slate-100 ${isDark ? 'dark' : ''} ${
          isDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800'
            : 'bg-gradient-to-b from-violet-50 via-[#FAF5FF] to-white'
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-violet-500 dark:focus:bg-slate-800 dark:focus:ring-violet-400"
        >
          跳到主内容
        </a>
        <Nav />
        <main id="main" className="pt-24">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/create-store" component={CreateStore} />
            <Route path="/use-store" component={UseStore} />
            <Route path="/collections" component={Collections} />
            <Route path="/subscribe" component={Subscribe} />
            <Route path="/performance" component={Performance} />
          </Switch>
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
