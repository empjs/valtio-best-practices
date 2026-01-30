import { FormWithHistory } from '../components'

export function HistoryDemo() {
  return (
    <div style={{ padding: '20px', background: '#f3e5f5', margin: '10px' }}>
      <h3>✅ 带历史记录（局部）</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        每个表单独立的撤销/重做历史
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <FormWithHistory title="Form A" />
        <FormWithHistory title="Form B" />
      </div>

      <div style={{ marginTop: '10px', padding: '10px', background: '#fff' }}>
        <strong>代码：</strong>
        <pre style={{ fontSize: '12px' }}>
          {`function FormComponent() {
  const [snap, store] = CounterStore.useLocalWithHistory(
    { count: 0, name: '' },
    { limit: 10 }
  );
  return (
    <div>
      <button onClick={() => store.value.increment()}>+1</button>
      <button onClick={() => store.undo()}>Undo</button>
      <button onClick={() => store.redo()}>Redo</button>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  )
}
