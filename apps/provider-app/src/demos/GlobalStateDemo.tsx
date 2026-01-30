import { GlobalCounter } from '../components'

export function GlobalStateDemo() {
  return (
    <div style={{ padding: '20px', background: '#e3f2fd', margin: '10px' }}>
      <h3>✅ 全局状态模式 - 所有组件同步</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        所有 Counter 组件共享同一个 store，状态同步
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <GlobalCounter title="View A" />
        <GlobalCounter title="View B" />
        <GlobalCounter title="View C" />
      </div>

      <div style={{ marginTop: '10px', padding: '10px', background: '#fff' }}>
        <strong>代码：</strong>
        <pre style={{ fontSize: '12px' }}>
          {`const globalStore = CounterStore.createGlobal({ count: 0 });

function Component() {
  const [snap, store] = CounterStore.use(globalStore);
  return <div onClick={() => store.increment()}>{snap.count}</div>;
}`}
        </pre>
      </div>
    </div>
  )
}
