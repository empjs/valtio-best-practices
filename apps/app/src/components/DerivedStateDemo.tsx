import React from 'react'
import {CartStore} from '../stores/CartStore'

function ShoppingCartComponent({title}: {title: string}) {
  const [baseSnap, baseStore, derivedSnap] = CartStore.useWithDerived({items: []}, (get, store) => {
    const snap = get(store)
    return {
      total: snap.items.reduce((sum, item) => sum + item.price, 0),
      count: snap.items.length,
    }
  })

  return (
    <div className="p-4 border-2 border-orange-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">{title}</h4>

      <button
        onClick={() =>
          baseStore.addItem({
            name: 'Item ' + (baseSnap.items.length + 1),
            price: Math.floor(Math.random() * 50) + 10,
          })
        }
        className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition mb-4"
      >
        Add Random Item
      </button>

      <p className="text-gray-800">
        <strong>Items: {derivedSnap.count}</strong>
      </p>
      <p className="text-gray-800">
        <strong>Total: ${derivedSnap.total}</strong>
      </p>

      <ul className="text-xs mt-2 space-y-1">
        {baseSnap.items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-1 bg-gray-50 rounded">
            <span>
              {item.name} - ${item.price}
            </span>
            <button
              onClick={() => baseStore.removeItem(item.id)}
              className="text-red-500 font-bold hover:text-red-700 px-2"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DerivedStateDemo() {
  return (
    <div className="p-5 bg-red-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">✅ 派生状态（局部）</h3>
      <p className="text-sm text-gray-600 mb-4">每个购物车独立计算，互不影响</p>

      <div className="flex flex-wrap gap-2.5">
        <ShoppingCartComponent title="Cart A" />
        <ShoppingCartComponent title="Cart B" />
      </div>

      <div className="mt-4 p-3 bg-white rounded border border-gray-200">
        <strong className="block mb-2 text-gray-700">代码：</strong>
        <pre className="text-xs text-gray-600 overflow-x-auto p-2 bg-gray-50 rounded">
          {`function CartComponent() {
  const [baseSnap, baseStore, derivedSnap] = CartStore.useLocalWithDerived(
    { items: [] },
    (get, store) => {
      const snap = get(store);
      return {
        total: snap.items.reduce((sum, item) => sum + item.price, 0),
        count: snap.items.length
      }
    }
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
