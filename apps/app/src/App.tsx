import React from 'react'
import {Link, Route, Switch, useLocation} from 'wouter'
import {BasicsPage} from './components/BasicsPage'
import {HomePage} from './components/HomePage'
import {MorePage} from './components/MorePage'
import {PerfPage} from './components/PerfPage'

function NavLink({href, children}: {href: string; children: React.ReactNode}) {
  const [location] = useLocation()
  const isActive = location === href || (href !== '/' && location.startsWith(href))
  return (
    <Link href={href}>
      <a
        className={`px-3 py-2 rounded transition font-medium ${
          isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        {children}
      </a>
    </Link>
  )
}

export default function App() {
  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen text-gray-800">
      <header className="flex items-center gap-4 mb-6 border-b pb-4">
        <Link href="/">
          <a className="text-3xl font-extrabold text-gray-900 hover:text-gray-700">EMP ValtioStore</a>
        </Link>
        <nav className="flex gap-1">
          <NavLink href="/">首页</NavLink>
          <NavLink href="/basics">已有 Demo</NavLink>
          <NavLink href="/perf">高性能</NavLink>
          <NavLink href="/more">其他</NavLink>
        </nav>
      </header>

      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/basics" component={BasicsPage} />
          <Route path="/perf" component={PerfPage} />
          <Route path="/more" component={MorePage} />
          <Route path="/:rest*">
            <div className="text-gray-500">未找到页面</div>
          </Route>
        </Switch>
      </main>
    </div>
  )
}
