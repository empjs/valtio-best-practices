import { UserProfile } from '../components'

export function AsyncStateDemo() {
  return (
    <div style={{ padding: '20px', background: '#e0f7fa', margin: '10px' }}>
      <h3>✅ 异步状态（局部）</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        每个组件独立加载数据，互不干扰
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <UserProfile userId={1} />
        <UserProfile userId={2} />
        <UserProfile userId={3} />
      </div>
    </div>
  )
}
