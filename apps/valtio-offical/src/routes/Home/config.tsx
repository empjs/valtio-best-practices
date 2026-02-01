import type {ReactNode} from 'react'
import {Link} from 'wouter'

export const installCommands = [
  {cmd: 'pnpm add @empjs/valtio', label: 'pnpm'},
  {cmd: 'npm install @empjs/valtio', label: 'npm'},
  {cmd: 'bun add @empjs/valtio', label: 'bun'},
  {cmd: 'yarn add @empjs/valtio', label: 'yarn'},
] as const

export type InstallLabel = (typeof installCommands)[number]['label']

export const cards = [
  {href: '/use', titleKey: 'home.cards.createStore', descKey: 'home.cards.createStoreDesc'},
  {href: '/collections', titleKey: 'home.cards.collections', descKey: 'home.cards.collectionsDesc'},
  {href: '/subscribe', titleKey: 'home.cards.subscribe', descKey: 'home.cards.subscribeDesc'},
  {href: '/performance', titleKey: 'home.cards.performance', descKey: 'home.cards.performanceDesc'},
] as const

/** 与原生 Valtio 相比的核心优势 */
export const advantages: Array<{
  titleKey: string
  descKey: string
  icon: (className: string) => ReactNode
}> = [
  {
    titleKey: 'home.adv.boilerplate.title',
    descKey: 'home.adv.boilerplate.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.typescript.title',
    descKey: 'home.adv.typescript.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.derive.title',
    descKey: 'home.adv.derive.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.undo.title',
    descKey: 'home.adv.undo.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 10h10a5 5 0 015 5v2M3 14h10a5 5 0 005-5v-2M21 10l-2 2 2 2M21 14l-2-2 2-2" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.persist.title',
    descKey: 'home.adv.persist.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.local.title',
    descKey: 'home.adv.local.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.tools.title',
    descKey: 'home.adv.tools.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    titleKey: 'home.adv.devtools.title',
    descKey: 'home.adv.devtools.desc',
    icon: cls => (
      <svg
        className={cls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      </svg>
    ),
  },
]

/** 用法导航卡片：带 logo、hover 高亮与描边 */
export const docCardIcons: Record<string, (cls: string) => ReactNode> = {
  use: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
  collections: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2zM7 11V7a2 2 0 012-2h6a2 2 0 012 2v4" />
    </svg>
  ),
  subscribe: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  performance: cls => (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
    </svg>
  ),
}
