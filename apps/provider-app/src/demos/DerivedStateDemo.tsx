import { ShoppingCart } from '../components'

export function DerivedStateDemo() {
  return (
    <div style={{ padding: '20px', background: '#ffebee', margin: '10px' }}>
      <h3>✅ 派生状态（局部）</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        每个购物车独立计算，互不影响
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <ShoppingCart title="Cart A" />
        <ShoppingCart title="Cart B" />
      </div>

      <div style={{ marginTop: '10px', padding: '10px', background: '#fff' }}>
        <strong>代码：</strong>
        <pre style={{ fontSize: '12px' }}>
          {`function CartComponent() {
  const [baseSnap, baseStore, derivedSnap] = CartStore.useLocalWithDerived(
    { items: [] },
    (get) => ({
      total: get.items.reduce((sum, item) => sum + item.price, 0),
      count: get.items.length
    })
  );
  return (
    <div>
      <p>Total: \${derivedSnap.total}</p>
      <button onClick={() => baseStore.addItem({...})}>Add</button>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  )
}
