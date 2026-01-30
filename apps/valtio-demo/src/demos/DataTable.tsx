/**
 * 示例 6: 数据表格（分页、排序、过滤）
 */

import {useStoreWithDerived} from '@empjs/valtio'
import React from 'react'

const INITIAL_DATA = [
  {id: 1, name: 'Alice', age: 25, city: 'New York'},
  {id: 2, name: 'Bob', age: 30, city: 'London'},
  {id: 3, name: 'Charlie', age: 35, city: 'Paris'},
  {id: 4, name: 'David', age: 28, city: 'Tokyo'},
  {id: 5, name: 'Eve', age: 32, city: 'Berlin'},
]

export function DataTable() {
  const [baseSnap, baseStore, derivedSnap] = useStoreWithDerived(
    () => ({
      data: [...INITIAL_DATA],
      currentPage: 1,
      pageSize: 2,
      sortBy: 'name' as 'name' | 'age' | 'city',
      sortOrder: 'asc' as 'asc' | 'desc',
      searchTerm: '',
      setPage(page: number) {
        this.currentPage = page
      },
      setSort(field: 'name' | 'age' | 'city') {
        if (this.sortBy === field) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortBy = field
          this.sortOrder = 'asc'
        }
      },
      setSearch(term: string) {
        this.searchTerm = term
        this.currentPage = 1
      },
    }),
    (get, base) => {
      const state = get(base)
      const filtered = state.data.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(state.searchTerm.toLowerCase())),
      )
      const sorted = [...filtered].sort((a, b) => {
        const aVal = a[state.sortBy]
        const bVal = b[state.sortBy]
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return state.sortOrder === 'asc' ? comparison : -comparison
      })
      const totalPages = Math.ceil(sorted.length / state.pageSize)
      const startIndex = (state.currentPage - 1) * state.pageSize
      const paginatedData = sorted.slice(startIndex, startIndex + state.pageSize)
      return {
        filteredData: filtered,
        sortedData: sorted,
        paginatedData,
        totalPages,
        totalItems: sorted.length,
      }
    },
  )

  const paginatedData = derivedSnap.paginatedData ?? []
  const totalPages = derivedSnap.totalPages ?? 1
  const totalItems = derivedSnap.totalItems ?? 0

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">数据表格（分页 / 排序 / 过滤）</h2>

      <input
        placeholder="搜索..."
        value={baseSnap.searchTerm}
        onChange={e => baseStore.setSearch(e.target.value)}
        aria-label="搜索表格"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      />

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {(['name', 'age', 'city'] as const).map(field => (
                <th
                  key={field}
                  scope="col"
                  onClick={() => baseStore.setSort(field)}
                  className="cursor-pointer px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  {field} {baseSnap.sortBy === field && (baseSnap.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map(row => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800">{row.name}</td>
                <td className="px-4 py-3 text-slate-600">{row.age}</td>
                <td className="px-4 py-3 text-slate-600">{row.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => baseStore.setPage(baseSnap.currentPage - 1)}
          disabled={baseSnap.currentPage === 1}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          上一页
        </button>
        <span className="text-sm text-slate-600">
          第 {baseSnap.currentPage} / {totalPages} 页 (共 {totalItems} 条)
        </span>
        <button
          type="button"
          onClick={() => baseStore.setPage(baseSnap.currentPage + 1)}
          disabled={baseSnap.currentPage === totalPages}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </section>
  )
}
