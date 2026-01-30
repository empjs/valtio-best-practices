/**
 * 示例 3: 购物车（派生状态）
 */

import {useStoreWithDerived} from '@empjs/valtio'
import React from 'react'

export function ShoppingCart() {
  const [baseSnap, baseStore, derivedSnap] = useStoreWithDerived(
    () => ({
      items: [] as {id: number; name: string; price: number; quantity: number}[],
      discountCode: '',
      discountPercent: 0,

      addItem(item: {id: number; name: string; price: number}) {
        const existing = this.items.find(i => i.id === item.id)
        if (existing) {
          existing.quantity++
        } else {
          this.items.push({...item, quantity: 1})
        }
      },

      removeItem(id: number) {
        this.items = this.items.filter(i => i.id !== id)
      },

      updateQuantity(id: number, quantity: number) {
        const item = this.items.find(i => i.id === id)
        if (item) {
          item.quantity = Math.max(1, quantity)
        }
      },

      applyDiscount(code: string) {
        this.discountCode = code
        this.discountPercent = code === 'SAVE10' ? 10 : code === 'SAVE20' ? 20 : 0
      },
    }),
    (get, base) => {
      const state = get(base)
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const discount = (subtotal * state.discountPercent) / 100
      const total = subtotal - discount
      const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
      return {subtotal, discount, total, itemCount}
    },
  )

  const subtotal = derivedSnap.subtotal ?? 0
  const discount = derivedSnap.discount ?? 0
  const total = derivedSnap.total ?? 0
  const itemCount = derivedSnap.itemCount ?? 0

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">购物车（派生状态） ({itemCount} 件)</h2>

      {baseSnap.items.length === 0 ? (
        <p className="rounded-lg bg-slate-50 py-6 text-center text-slate-500">购物车为空</p>
      ) : (
        <>
          <ul className="mb-6 space-y-3">
            {baseSnap.items.map(item => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <span className="min-w-[8rem] font-medium text-slate-800">
                  {item.name} · ${(item.price ?? 0).toFixed(2)}
                </span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => baseStore.updateQuantity(item.id, Number.parseInt(e.target.value, 10))}
                  min={1}
                  aria-label={`${item.name} 数量`}
                  className="w-16 rounded border border-slate-300 px-2 py-1 text-center text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
                <span className="text-slate-600">= ${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => baseStore.removeItem(item.id)}
                  className="ml-auto rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>

          <div className="mb-4 space-y-1 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">小计: ${subtotal.toFixed(2)}</p>
            {discount > 0 && (
              <p className="text-sm text-green-600">
                折扣 ({baseSnap.discountPercent}%): -${discount.toFixed(2)}
              </p>
            )}
            <p className="text-base font-semibold text-slate-800">总计: ${total.toFixed(2)}</p>
          </div>

          <div className="mb-6 flex gap-2">
            <input
              placeholder="优惠码"
              value={baseSnap.discountCode}
              onChange={e => (baseStore.discountCode = e.target.value)}
              aria-label="优惠码"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <button
              type="button"
              onClick={() => baseStore.applyDiscount(baseSnap.discountCode)}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              应用
            </button>
          </div>
        </>
      )}

      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700">添加商品</h3>
        <button
          type="button"
          onClick={() =>
            baseStore.addItem({
              id: Date.now(),
              name: '商品 ' + Math.floor(Math.random() * 100),
              price: Math.random() * 50 + 10,
            })
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          添加随机商品
        </button>
      </div>
    </section>
  )
}
