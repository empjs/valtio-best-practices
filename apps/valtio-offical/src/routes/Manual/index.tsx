import {lazy} from 'react'

export const Manual = lazy(() =>
  import('./Manual.page').then(m => ({default: m.ManualPage}))
)
