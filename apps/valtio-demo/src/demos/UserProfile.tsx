/**
 * 示例 4: 用户资料（异步加载）
 */

import {useAsyncStore} from '@empjs/valtio'
import React, {useEffect} from 'react'

type User = {id: string; name: string; email: string; avatar: string}
type Post = {id: number; title: string; [key: string]: unknown}

export function UserProfile({userId}: {userId: string}) {
  const [snap, store] = useAsyncStore(() => ({
    user: null as User | null,
    posts: [] as Post[],
    updateUser(updates: Partial<User>) {
      if (this.user) Object.assign(this.user, updates)
    },
  }))

  const fetchUser = store.async('fetchUser', async (id: string) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    const user = await response.json()
    store.user = user
    return user
  })

  const fetchPosts = store.async('fetchPosts', async (uid: string) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${uid}/posts`)
    const posts = await response.json()
    store.posts = posts
    return posts
  })

  useEffect(() => {
    fetchUser(userId)
    fetchPosts(userId)
  }, [userId])

  if (snap._loading.fetchUser) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          加载用户信息...
        </div>
      </section>
    )
  }

  if (snap._error.fetchUser) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        错误: {(snap._error.fetchUser as Error).message}
      </section>
    )
  }

  if (!snap.user) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
        <p className="text-slate-500">未找到用户</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">用户资料（异步加载）</h2>
      <p className="mb-1 font-medium text-slate-800 dark:text-slate-200">{snap.user.name}</p>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">Email: {snap.user.email}</p>

      <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">文章列表</h3>
      {snap._loading.fetchPosts ? (
        <div className="flex items-center gap-2 py-4 text-slate-500">
          <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          加载文章...
        </div>
      ) : snap._error.fetchPosts ? (
        <p className="text-red-600">加载文章失败</p>
      ) : (
        <ul className="space-y-1.5">
          {snap.posts.map(post => (
            <li
              key={post.id}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {post.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
