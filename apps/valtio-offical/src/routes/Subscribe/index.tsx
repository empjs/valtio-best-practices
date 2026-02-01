import {lazy} from 'react'

export const Subscribe = lazy(() =>
  import('./Subscribe.page').then(m => ({default: m.SubscribePage}))
)
