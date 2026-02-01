import {subscribe, useStore} from '@empjs/valtio'
import {useEffect, useRef} from 'react'
import {useT} from 'src/i18n'

export function TransientDemo() {
  const t = useT()
  const boxRef = useRef<HTMLDivElement>(null)
  const posRef = useRef<HTMLDivElement>(null)
  const [_, store] = useStore(() => ({x: 0, y: 0}))

  useEffect(() => {
    return subscribe(store, () => {
      if (posRef.current) {
        posRef.current.innerText = `x: ${store.x.toFixed(0)}, y: ${store.y.toFixed(0)}`
      }
      if (boxRef.current) {
        boxRef.current.style.transform = `translate(${store.x}px, ${store.y}px)`
      }
    })
  }, [store])

  const handleMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    store.x = e.clientX - rect.left - 20
    store.y = e.clientY - rect.top - 20
  }

  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('performance.s3Title')}</h3>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{t('performance.s3Desc')}</p>
      <div className="mb-2 text-xs text-slate-500">Component Renders: {renderCount.current} (Static)</div>
      <div
        className="relative flex-1 cursor-crosshair overflow-hidden rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
        onMouseMove={handleMove}
      >
        <div ref={posRef} className="absolute top-2 left-2 text-xs font-mono text-slate-500 pointer-events-none">
          waiting...
        </div>
        <div
          ref={boxRef}
          className="absolute h-10 w-10 rounded-full bg-blue-500/50 shadow-sm pointer-events-none"
          style={{top: 0, left: 0, willChange: 'transform'}}
        />
      </div>
    </div>
  )
}
