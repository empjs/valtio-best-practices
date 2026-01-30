/**
 * 示例 2: Todo 应用（带历史记录）
 */

import {useStoreWithHistory} from '@empjs/valtio'
import {useState} from 'react'

export function TodoApp() {
  const [snap, store] = useStoreWithHistory(
    () => ({
      todos: [] as {id: number; text: string; done: boolean}[],
      filter: 'all',

      addTodo(text: string) {
        this.todos.push({
          id: Date.now(),
          text,
          done: false,
        })
      },

      toggleTodo(id: number) {
        const todo = this.todos.find(t => t.id === id)
        if (todo) todo.done = !todo.done
      },

      deleteTodo(id: number) {
        this.todos = this.todos.filter(t => t.id !== id)
      },

      setFilter(filter: 'all' | 'active' | 'completed') {
        this.filter = filter
      },
    }),
    {limit: 50},
  )

  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (input.trim()) {
      store.value.addTodo(input)
      setInput('')
    }
  }

  const filteredTodos = snap.value.todos.filter(todo => {
    if (snap.value.filter === 'active') return !todo.done
    if (snap.value.filter === 'completed') return todo.done
    return true
  })

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">Todo List（带撤销/重做）</h2>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => store.undo()}
          disabled={!snap.isUndoEnabled}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↶ 撤销
        </button>
        <button
          type="button"
          onClick={() => store.redo()}
          disabled={!snap.isRedoEnabled}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↷ 重做
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
          aria-label="新 Todo 内容"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="输入待办..."
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          添加
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {(['all', 'active', 'completed'] as const).map(filter => (
          <button
            key={filter}
            type="button"
            onClick={() => store.value.setFilter(filter)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              snap.value.filter === filter
                ? 'bg-slate-700 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => store.value.toggleTodo(todo.id)}
              aria-label={`完成: ${todo.text}`}
              className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
            />
            <span className={`flex-1 text-sm ${todo.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => store.value.deleteTodo(todo.id)}
              className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
