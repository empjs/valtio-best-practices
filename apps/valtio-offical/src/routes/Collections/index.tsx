import {lazy} from 'react'

export const Collections = lazy(() =>
  import('./Collections.page').then(m => ({default: m.CollectionsPage}))
)
