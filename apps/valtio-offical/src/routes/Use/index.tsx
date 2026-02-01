import {lazy} from 'react'

export const Use = lazy(() =>
  import('./Use.page').then(m => ({default: m.UsePage}))
)
