import {AsyncStateDemo, DerivedStateDemo, GlobalStateDemo, HistoryDemo, LocalStateDemo, MixedDemo} from './demos'

export default function App() {
  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        background: '#fafafa',
      }}
    >
      <h1>ValtioStore v3 - 多文件 Demo</h1>

      <div
        style={{
          background: '#fff',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #4CAF50',
        }}
      >
        <h2>🎯 核心 API</h2>
        <ul>
          <li>
            <strong>useLocal()</strong> - 每个组件独立 store，状态完全隔离
          </li>
          <li>
            <strong>useGlobal()</strong> - 所有组件共享 store，状态同步
          </li>
          <li>
            <strong>useLocalWithHistory()</strong> - 局部 + 撤销/重做
          </li>
          <li>
            <strong>useLocalWithDerived()</strong> - 局部 + 派生状态
          </li>
          <li>
            <strong>useLocalAsync()</strong> - 局部 + 异步 loading/error
          </li>
        </ul>
      </div>

      <LocalStateDemo />
      <GlobalStateDemo />
      <MixedDemo />
      <HistoryDemo />
      <DerivedStateDemo />
      <AsyncStateDemo />

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          background: '#fff',
          border: '2px solid #FF9800',
        }}
      >
        <h2>📁 文件结构</h2>
        <pre style={{background: '#f5f5f5', padding: '10px', fontSize: '12px'}}>
          {`src/
├── stores/
│   ├── counterStore.ts
│   ├── cartStore.ts
│   ├── userStore.ts
│   ├── globalInstances.ts
│   └── index.ts
├── components/
│   ├── LocalCounter.tsx
│   ├── GlobalCounter.tsx
│   ├── FormWithHistory.tsx
│   ├── ShoppingCart.tsx
│   ├── UserProfile.tsx
│   └── index.ts
├── demos/
│   ├── LocalStateDemo.tsx
│   ├── GlobalStateDemo.tsx
│   ├── MixedDemo.tsx
│   ├── HistoryDemo.tsx
│   ├── DerivedStateDemo.tsx
│   ├── AsyncStateDemo.tsx
│   └── index.ts
├── App.tsx
└── index.tsx`}
        </pre>
      </div>
    </div>
  )
}
