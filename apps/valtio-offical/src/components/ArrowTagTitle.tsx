import {useContext} from 'react'
import {ThemeContext} from './Nav'

/** 箭头标签标题：前缀 + [tag] → [tag] → … + 后缀，用于代码块等展示 */
export function ArrowTagTitle({
  prefix,
  steps,
  suffix,
}: {
  prefix: string
  steps: string[]
  suffix?: string
}) {
  const ctx = useContext(ThemeContext)
  const isDark = ctx?.isDark ?? false

  const tagClass = isDark
    ? 'rounded-md border border-slate-600/80 bg-slate-700/60 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors duration-200'
    : 'rounded-md border border-slate-200 bg-slate-100/90 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors duration-200 dark:border-slate-600/80 dark:bg-slate-700/60 dark:text-slate-200'

  const arrowClass = isDark ? 'text-slate-500' : 'text-slate-400 dark:text-slate-500'
  const suffixClass = isDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span className="font-medium text-slate-600 dark:text-slate-300">{prefix}</span>
      {steps.length > 0 && (
        <>
          {steps.map((label, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              {i > 0 && (
                <svg
                  className={`h-3.5 w-3.5 shrink-0 ${arrowClass}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
              <span className={tagClass}>{label}</span>
            </span>
          ))}
          {suffix != null && suffix !== '' && (
            <span className={`ml-0.5 text-xs ${suffixClass}`}>，{suffix}</span>
          )}
        </>
      )}
    </span>
  )
}
