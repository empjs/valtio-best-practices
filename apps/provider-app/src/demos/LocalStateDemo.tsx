import { LocalCounter } from '../components'

export function LocalStateDemo() {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px' }}>
      <h3>✅ 局部状态模式 - 状态完全隔离</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        每个 Counter 组件有独立的 store，互不影响
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <LocalCounter title="Counter A" />
        <LocalCounter title="Counter B" />
        <LocalCounter title="Counter C" />
      </div>

      <div style={{ marginTop: '10px', padding: '10px', background: '#fff' }}>
        <strong>代码：</strong>
        <pre style={{ fontSize: '12px' }}>
          {`function LocalCounterComponent() {
  const [snap, store] = CounterStore.useLocal();
  return <div onClick={() => store.increment()}>{snap.count}</div>;
}`}
        </pre>
      </div>
    </div>
  )
}
