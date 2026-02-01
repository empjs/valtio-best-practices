import React from 'react'

/**
 * Skeleton Component
 * A themed skeleton screen that mimics the PageWithDemo layout.
 * Features a shimmering animation and subtle theme tints.
 */
export const Skeleton: React.FC = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 animate-pulse">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
        {/* Left Column: Content */}
        <div className="space-y-6">
          {/* Title Area */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>

          {/* Text Blocks */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-900/50"></div>
            <div className="h-4 w-[90%] rounded bg-slate-100 dark:bg-slate-900/50"></div>
            <div className="h-4 w-[95%] rounded bg-slate-100 dark:bg-slate-900/50"></div>
          </div>

          {/* Code Block Skeleton */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="space-y-2">
              <div className="h-3 w-[40%] rounded bg-slate-200/50 dark:bg-slate-800/50"></div>
              <div className="h-3 w-[60%] rounded bg-slate-200/50 dark:bg-slate-800/50"></div>
              <div className="h-3 w-[30%] rounded bg-slate-200/50 dark:bg-slate-800/50"></div>
              <div className="h-3 w-[50%] rounded bg-slate-200/50 dark:bg-slate-800/50"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Demo Area */}
        <aside className="lg:sticky lg:top-4">
          <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-900/20 flex items-center justify-center">
            {/* Subtle glow in the center of the demo skeleton */}
            <div className="h-20 w-20 rounded-full bg-blue-500/5 blur-xl"></div>
          </div>
        </aside>
      </div>

      {/* Shimmer Effect Keyframes (global styles already handle pulse, but we can add a custom shimmer if needed) */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  )
}

export default Skeleton
