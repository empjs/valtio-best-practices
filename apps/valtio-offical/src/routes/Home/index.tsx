import {lazy} from 'react'

export const Home = lazy(() =>
  import('./Home.page').then(m => ({default: m.HomePage}))
)
