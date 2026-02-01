import {type EnhancedStore} from '@empjs/valtio'
import {useEffect, useState} from 'react'
import {useT} from 'src/i18n'

interface SubscribeKeyProps {
  store: EnhancedStore<{count: number; name: string}>
  btn: string
}

export function SubscribeKeyDemo({store, btn}: SubscribeKeyProps) {
  const t = useT()
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    // subscribeKey: 只监听 count
    const unsub = store.subscribeKey('count', (val: number) => {
      setLog(prev => [`[${new Date().toLocaleTimeString()}] count changed to: ${val}`, ...prev].slice(0, 5))
    })
    return unsub
  }, [store])

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('subscribe.keyTitle')}</h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('subscribe.keyDesc')}</p>

      <div className="flex-1 rounded border border-slate-200 bg-slate-50 p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-900 overflow-auto min-h-[100px] mb-2">
        {log.length === 0 ? (
          <span className="text-slate-400">Waiting for count updates...</span>
        ) : (
          log.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => store.count++} className={btn}>
          count++
        </button>
        <button
          onClick={() => (store.name = store.name === 'x' ? 'y' : 'x')}
          className={`${btn} bg-slate-500 hover:bg-slate-600`}
        >
          Toggle Name (Ignored)
        </button>
      </div>
    </div>
  )
}
