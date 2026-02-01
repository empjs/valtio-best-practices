import type {ComponentType} from 'react'

export interface RouteConfig {
  path: string
  load: () => Promise<{default: ComponentType<unknown>}>
}

/** 路由表：仅定义 path 与 load，不在 App 中静态引用任何页面，实现按路径真实动态加载 */
export const routes: RouteConfig[] = [
  {path: '/', load: () => import('./Home/Home.page').then(m => ({default: m.HomePage}))},
  {path: '/use', load: () => import('./Use/Use.page').then(m => ({default: m.UsePage}))},
  {path: '/collections', load: () => import('./Collections/Collections.page').then(m => ({default: m.CollectionsPage}))},
  {path: '/subscribe', load: () => import('./Subscribe/Subscribe.page').then(m => ({default: m.SubscribePage}))},
  {path: '/performance', load: () => import('./Performance/Performance.page').then(m => ({default: m.PerformancePage}))},
  {path: '/manual', load: () => import('./Manual/Manual.page').then(m => ({default: m.ManualPage}))},
  {path: '/best-practices', load: () => import('./BestPractices/BestPractices.page').then(m => ({default: m.BestPracticesPage}))},
]
