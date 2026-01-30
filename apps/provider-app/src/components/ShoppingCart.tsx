import { CartStore } from '../stores'
import { CartItem } from '../stores'

interface ShoppingCartProps {
  title: string
}

export function ShoppingCart({ title }: ShoppingCartProps) {
  const [baseSnap, baseStore, derivedSnap] = CartStore.useLocalWithDerived(
    { items: [] },
    (get) => {
      const items = get.items as CartItem[]
      return {
        total: items.reduce((sum, item) => sum + item.price, 0),
        count: items.length,
      }
    },
  )

  const items = (baseSnap.items || []) as CartItem[]

  return (
    <div style={{ padding: '15px', border: '2px solid #FF5722', margin: '10px' }}>
      <h4>{title}</h4>

      <button
        type="button"
        onClick={() =>
          baseStore.addItem({
            name: `Item ${items.length + 1}`,
            price: Math.floor(Math.random() * 50) + 10,
          })
        }
      >
        Add Random Item
      </button>

      <p>
        <strong>Items: {derivedSnap.count}</strong>
      </p>
      <p>
        <strong>Total: ${derivedSnap.total}</strong>
      </p>

      <ul style={{ fontSize: '12px' }}>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button
              type="button"
              onClick={() => baseStore.removeItem(item.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
