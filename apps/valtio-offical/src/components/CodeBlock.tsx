import {useContext, useState} from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark, oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {ThemeContext} from './Nav'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export function CodeBlock({code, language = 'typescript', title}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const ctx = useContext(ThemeContext)
  const isDark = ctx?.isDark ?? false

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <figure
      className={`my-4 overflow-hidden rounded-lg border ${
        isDark
          ? 'border-blue-800/60 bg-blue-950'
          : 'border-slate-200 bg-white dark:border-blue-800/60 dark:bg-blue-950'
      }`}
    >
      {(title ?? null) && (
        <figcaption
          className={`border-b px-3 py-2 text-sm ${
            isDark
              ? 'border-blue-800/60 bg-blue-900/80 text-slate-300'
              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-blue-800/60 dark:bg-blue-900/80 dark:text-slate-300'
          }`}
        >
          {title}
        </figcaption>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            paddingTop: '2.5rem',
            paddingRight: '4rem',
            paddingBottom: '1rem',
            paddingLeft: '1rem',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            background: 'transparent',
          }}
          codeTagProps={{className: isDark ? 'text-slate-100' : 'text-slate-800'}}
          showLineNumbers={false}
          PreTag="pre"
        >
          {code}
        </SyntaxHighlighter>
        <button
          type="button"
          onClick={handleCopy}
          className={`absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
            isDark
              ? 'hover:text-slate-100 focus-visible:ring-offset-blue-950 dark:hover:text-orange-300'
              : 'hover:text-slate-700 focus-visible:ring-offset-white dark:hover:text-orange-300'
          }`}
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? (
            <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
        </button>
      </div>
    </figure>
  )
}
