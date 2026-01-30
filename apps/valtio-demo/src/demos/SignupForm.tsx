/**
 * 示例 5: 表单管理（带验证）
 */

import {useStore} from '@empjs/valtio'
import React from 'react'

export function SignupForm() {
  const [snap, store] = useStore(() => ({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    errors: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate(): boolean {
      this.errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ? '' : '邮箱格式不正确'
      this.errors.password = this.password.length >= 6 ? '' : '密码至少 6 位'
      this.errors.confirmPassword = this.password === this.confirmPassword ? '' : '两次密码不一致'
      return !this.errors.email && !this.errors.password && !this.errors.confirmPassword && this.acceptTerms
    },
    reset() {
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
      this.acceptTerms = false
      this.errors = {email: '', password: '', confirmPassword: ''}
    },
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (store.validate()) {
      console.log('提交表单:', {email: snap.email, password: snap.password})
      store.reset()
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">注册表单（带验证）</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-slate-700">
            邮箱
          </label>
          <input
            id="signup-email"
            type="email"
            value={snap.email}
            onChange={e => (store.email = e.target.value)}
            onBlur={() => store.validate()}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {snap.errors.email && <span className="mt-1 block text-sm text-red-600">{snap.errors.email}</span>}
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-slate-700">
            密码
          </label>
          <input
            id="signup-password"
            type="password"
            value={snap.password}
            onChange={e => (store.password = e.target.value)}
            onBlur={() => store.validate()}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {snap.errors.password && <span className="mt-1 block text-sm text-red-600">{snap.errors.password}</span>}
        </div>

        <div>
          <label htmlFor="signup-confirm" className="mb-1 block text-sm font-medium text-slate-700">
            确认密码
          </label>
          <input
            id="signup-confirm"
            type="password"
            value={snap.confirmPassword}
            onChange={e => (store.confirmPassword = e.target.value)}
            onBlur={() => store.validate()}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {snap.errors.confirmPassword && (
            <span className="mt-1 block text-sm text-red-600">{snap.errors.confirmPassword}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="signup-terms"
            type="checkbox"
            checked={snap.acceptTerms}
            onChange={e => (store.acceptTerms = e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
          />
          <label htmlFor="signup-terms" className="text-sm text-slate-700">
            同意服务条款
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-700 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          注册
        </button>
      </form>
    </section>
  )
}
