import {Route, Switch} from 'wouter'
import {Nav} from './components/Nav'
import {Collections, CreateStore, Home, Performance, Subscribe, UseStore} from './routes/index'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-slate-400 dark:focus:bg-slate-800 dark:focus:ring-slate-500"
      >
        跳到主内容
      </a>
      <Nav />
      <main id="main">
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
  )
}

export default App
