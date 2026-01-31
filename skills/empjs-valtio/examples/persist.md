# 持久化

`store.persist('key')` 与 localStorage 双向同步，返回 `Unsubscribe`。

```tsx
import { createStore } from '@empjs/valtio'

const settingsStore = createStore({ theme: 'light' })
settingsStore.persist('app-settings')

function ThemeSwitch() {
  const snap = settingsStore.useSnapshot()
  return (
    <button onClick={() => settingsStore.set('theme', snap.theme === 'light' ? 'dark' : 'light')}>
      {snap.theme}
    </button>
  )
}
```
