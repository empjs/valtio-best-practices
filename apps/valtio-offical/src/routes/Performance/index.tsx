import {lazy} from 'react'

export const Performance = lazy(() =>
  import('./Performance.page').then(m => ({default: m.PerformancePage}))
)
