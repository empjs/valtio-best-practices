import { useEffect } from 'react'
import { UserStore } from '../stores'
import type { AsyncStoreWithMethods } from '@empjs/valtio-store'

interface UserProfileProps {
  userId: number
}

export function UserProfile({ userId }: UserProfileProps) {
  const [snap, store] = UserStore.useLocalAsync({ user: null })

  useEffect(() => {
    const fetchUser = (store as AsyncStoreWithMethods).async(
      'fetchUser',
      async function (this: { user: unknown }) {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
        )
        this.user = await response.json()
      },
    )
    fetchUser()
  }, [userId, store])

  const loading = snap._loading?.fetchUser
  const error = snap._error?.fetchUser

  if (loading) {
    return (
      <div style={{ padding: '15px', border: '2px solid #ccc' }}>
        Loading user {userId}...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '15px', border: '2px solid red' }}>
        Error loading user
      </div>
    )
  }

  const user = snap.user as { name: string; email: string; phone: string } | null

  return (
    <div style={{ padding: '15px', border: '2px solid #00BCD4', margin: '10px' }}>
      <h4>User Profile {userId}</h4>
      {user && (
        <div style={{ fontSize: '12px' }}>
          <p>
            <strong>{user.name}</strong>
          </p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
      )}
    </div>
  )
}
