import type React from 'react'
import { CounterStore } from '../stores'
import { globalCounterStore } from '../stores/globalInstances'

interface GlobalCounterProps {
  title: string
}

export function GlobalCounter({ title }: GlobalCounterProps) {
  const [snap, store] = CounterStore.use(globalCounterStore)

  return (
    <div style={{ padding: '15px', border: '2px solid #2196F3', margin: '10px' }}>
      <h4>{title}</h4>
      <p>Count: {snap.count}</p>
      <p>Name: {snap.name}</p>
      <button type="button" onClick={() => store.increment()}>
        +1
      </button>
      <button type="button" onClick={() => store.decrement()}>
        -1
      </button>
      <input
        value={snap.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => store.setName(e.target.value)}
        placeholder="Enter name"
      />
    </div>
  )
}
