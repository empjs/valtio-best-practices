import {type EmpStore} from '@empjs/valtio'
import {useT} from 'src/i18n'
import {OnlyCount, OnlyName} from './DemoComponents'

interface SubscribeBatchProps {
  store: EmpStore<{count: number; name: string}>
  renderLabel: string
  btn: string
}

export function SubscribeBatchDemo({store, renderLabel, btn}: SubscribeBatchProps) {
  const t = useT()

  const handleBatch = () => {
    store.batch((s: any) => {
      s.count = 0
      s.name = 'reset'
    })
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('subscribe.batchTitle')}</h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{t('subscribe.batchDesc')}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <OnlyCount store={store} renderLabel={renderLabel} />
        <OnlyName store={store} renderLabel={renderLabel} />
      </div>

      <button onClick={handleBatch} className={btn}>
        Batch Reset (count=0, name='reset')
      </button>
    </div>
  )
}
