import type {ReactNode} from 'react'

interface PageWithDemoProps {
  /** 左侧：标题、说明、代码块等 */
  children: ReactNode
  /** 右侧：运行效果等展示区，大屏固定右侧、移动端在下方 */
  demo: ReactNode
}

/**
 * 代码与展示左右结构：大屏两列（左代码、右展示），移动端单列上下堆叠（代码在上、展示在下）
 */
export function PageWithDemo({ children, demo }: PageWithDemoProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-8 sm:pt-8 sm:pb-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
        <div className="min-w-0">{children}</div>
        <aside
          className="shrink-0 lg:sticky lg:top-4"
          aria-label="运行效果"
        >
          {demo}
        </aside>
      </div>
    </main>
  )
}
