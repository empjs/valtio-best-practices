import {useState} from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

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
    <figure className="my-4 overflow-hidden rounded-lg border border-gray-700 bg-slate-900 dark:border-slate-700">
      {(title ?? null) && (
        <figcaption className="border-b border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300">
          {title}
        </figcaption>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            paddingTop: '2.5rem',
            paddingRight: '4rem',
            paddingBottom: '1rem',
            paddingLeft: '1rem',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
          codeTagProps={{ className: 'text-slate-100' }}
          showLineNumbers={false}
          PreTag="pre"
        >
          {code}
        </SyntaxHighlighter>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 min-h-[44px] min-w-[44px] cursor-pointer rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-300 transition-colors duration-200 hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
    </figure>
  )
}
