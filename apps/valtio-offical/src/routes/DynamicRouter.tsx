import {lazy, Suspense, useMemo} from 'react'
import {Loading} from 'src/components/Loading'
import {Skeleton} from 'src/components/Skeleton'
import {useT} from 'src/i18n'
import {useLocation} from 'wouter'
import {routes} from './config'

const lazyCache: Record<string, ReturnType<typeof lazy>> = {}

function getLazyComponent(path: string) {
  const route = routes.find(r => r.path === path)
  if (!route) return null
  if (!lazyCache[path]) {
    lazyCache[path] = lazy(route.load)
  }
  return lazyCache[path]
}

export function DynamicRouter() {
  const [location] = useLocation()
  const t = useT()
  const path = location ?? '/'
  const Component = useMemo(() => getLazyComponent(path), [path])

  if (!Component) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500 dark:text-slate-400">
        {t('common.notFound')}
      </div>
    )
  }

  return (
    <Suspense fallback={<Skeleton />}>
      <Component />
    </Suspense>
  )
}
