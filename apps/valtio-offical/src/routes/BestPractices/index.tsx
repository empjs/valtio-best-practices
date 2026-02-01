import {lazy} from 'react'

export const BestPractices = lazy(() => import('./BestPractices.page').then(m => ({default: m.BestPracticesPage})))
