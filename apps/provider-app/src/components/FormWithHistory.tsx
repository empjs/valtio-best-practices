import type React from 'react'
import { CounterStore } from '../stores'

interface FormWithHistoryProps {
  title: string
}

export function FormWithHistory({ title }: FormWithHistoryProps) {
  const [snap, store] = CounterStore.useLocalWithHistory(
    { count: 0, name: '' },
    { limit: 10 },
  )

  const value = snap.value as { count: number; name: string }
  const history = snap.history as { index: number; nodes: unknown[] }

  return (
    <div style={{ padding: '15px', border: '2px solid #9C27B0', margin: '10px' }}>
      <h4>{title}</h4>
      <p>Count: {value.count}</p>
      <p>Name: {value.name || '(empty)'}</p>

      <button type="button" onClick={() => store.value.increment()}>
        +1
      </button>
      <button type="button" onClick={() => store.value.decrement()}>
        -1
      </button>
      <input
        value={value.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => store.value.setName(e.target.value)}
        placeholder="Enter name"
      />

      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => store.undo()}
          disabled={history.index === 0}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => store.redo()}
          disabled={history.index === history.nodes.length - 1}
        >
          Redo
        </button>
        <span style={{ marginLeft: '10px', fontSize: '12px' }}>
          {history.index + 1} / {history.nodes.length}
        </span>
      </div>
    </div>
  )
}
