import React from 'react'

/**
 * Loading Component
 * A sophisticated, themed animated SVG loading component.
 * Features:
 * - Concentric orbits spinning in opposite directions.
 * - Theme-aware gradients matching the project brand.
 * - Pulsing core indicating activity.
 */
export const Loading: React.FC = () => {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8">
      <div className="relative h-24 w-24">
        {/* Glow Background */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10 blur-2xl dark:bg-blue-400/5"></div>

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full rotate-[-90deg]"
        >
          <defs>
            <linearGradient id="orbit-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary-mid)" />
            </linearGradient>
            <linearGradient id="orbit-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-mid)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Orbit */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-200 opacity-20 dark:text-slate-700"
          />
          <path
            d="M 50,10 A 40,40 0 0 1 90,50"
            stroke="url(#orbit-gradient-1)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Inner Orbit */}
          <circle
            cx="50"
            cy="50"
            r="25"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-200 opacity-20 dark:text-slate-700"
          />
          <path
            d="M 50,25 A 25,25 0 0 0 25,50"
            stroke="url(#orbit-gradient-2)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Pulsing Center Dot */}
          <circle cx="50" cy="50" r="6" fill="var(--color-primary)" className="opacity-80">
            <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="3" fill="white" className="dark:fill-slate-900" />
        </svg>

        {/* Text Fade-in */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium tracking-widest text-slate-400 uppercase opacity-60 animate-pulse">
          Loading
        </div>
      </div>
    </div>
  )
}

export default Loading
