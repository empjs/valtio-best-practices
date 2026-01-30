import React from 'react'
import {UserStore} from '../stores/UserStore'

function UserProfileComponent({userId}: {userId: number}) {
  const [snap, store] = UserStore.useAsync({user: null})

  // 定义异步方法
  React.useEffect(() => {
    store.fetchUser = store.async('fetchUser', async function () {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      this.user = await response.json()
    })

    store.fetchUser()
  }, [userId])

  if (snap._loading?.fetchUser) {
    return (
      <div className="p-4 border-2 border-gray-300 rounded m-2.5 text-gray-500 animate-pulse">
        Loading user {userId}...
      </div>
    )
  }

  if (snap._error?.fetchUser) {
    return <div className="p-4 border-2 border-red-500 rounded m-2.5 text-red-500">Error loading user</div>
  }

  return (
    <div className="p-4 border-2 border-cyan-500 m-2.5 rounded shadow-sm bg-white">
      <h4 className="text-lg font-bold mb-2">User Profile {userId}</h4>
      {snap.user && (
        <div className="text-xs text-gray-700 space-y-1">
          <p className="font-semibold text-sm">{snap.user.name}</p>
          <p>{snap.user.email}</p>
          <p>{snap.user.phone}</p>
        </div>
      )}
    </div>
  )
}

export function AsyncStateDemo() {
  return (
    <div className="p-5 bg-cyan-50 m-2.5 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800">✅ 异步状态（局部）</h3>
      <p className="text-sm text-gray-600 mb-4">每个组件独立加载数据，互不干扰</p>

      <div className="flex flex-wrap gap-2.5">
        <UserProfileComponent userId={1} />
        <UserProfileComponent userId={2} />
        <UserProfileComponent userId={3} />
      </div>
    </div>
  )
}
