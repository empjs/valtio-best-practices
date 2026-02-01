import {useEffect, useState} from 'react'
import {useT} from 'src/i18n'
import {type StoreWithCountName} from './DemoComponents'

interface SubscribeKeysProps {
  store: StoreWithCountName & {subscribeKeys: any; count: number; name: string}
  btn: string
}

export function SubscribeKeysDemo({store, btn}: SubscribeKeysProps) {
  const t = useT()
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    // subscribeKeys: 监听 count 和 name
    const unsub = store.subscribeKeys(['count', 'name'], (key: string, val: any) => {
      setLog(prev => [`[${new Date().toLocaleTimeString()}] ${key} => ${val}`, ...prev].slice(0, 5))
    })
    return unsub
  }, [store])

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('subscribe.keysTitle')}</h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('subscribe.keysDesc')}</p>

      <div className="flex-1 rounded border border-slate-200 bg-slate-50 p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-900 overflow-auto min-h-[100px] mb-2">
        {log.length === 0 ? (
          <span className="text-slate-400">Waiting for count/name updates...</span>
        ) : (
          log.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => store.count++} className={btn}>
          count++
        </button>
        <button onClick={() => (store.name = store.name === 'x' ? 'y' : 'x')} className={btn}>
          Toggle Name
        </button>
      </div>
    </div>
  )
}
