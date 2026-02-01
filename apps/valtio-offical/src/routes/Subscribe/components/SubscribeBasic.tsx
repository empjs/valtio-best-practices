import {type EnhancedStore, subscribe} from '@empjs/valtio'
import {useCallback, useEffect, useState} from 'react'
import {useT} from 'src/i18n'

interface SubscribeBasicProps {
  store: EnhancedStore<{count: number; name: string}>
  btn: string
}

export function SubscribeBasic({store, btn}: SubscribeBasicProps) {
  const t = useT()
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    // 基础 subscribe：监听整个 store（或 proxy）的任何变化
    const unsub = subscribe(store, () => {
      setLog(prev => [`[${new Date().toLocaleTimeString()}] store updated: count=${store.count}`, ...prev].slice(0, 5))
    })
    return unsub
  }, [store])

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('subscribe.basicTitle')}</h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('subscribe.basicDesc')}</p>

      <div className="flex-1 rounded border border-slate-200 bg-slate-50 p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-900 overflow-auto min-h-[100px] mb-2">
        {log.length === 0 ? (
          <span className="text-slate-400">Waiting for updates...</span>
        ) : (
          log.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>

      <button onClick={() => store.count++} className={btn}>
        count++
      </button>
    </div>
  )
}
