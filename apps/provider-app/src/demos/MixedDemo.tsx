import { LocalCounter, GlobalCounter } from '../components'

export function MixedDemo() {
  return (
    <div style={{ padding: '20px', background: '#fff3e0', margin: '10px' }}>
      <h3>✅ 混合模式 - 局部 + 全局</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        可以同时使用局部和全局状态，灵活组合
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <h4>局部状态区域</h4>
          <LocalCounter title="Local 1" />
          <LocalCounter title="Local 2" />
        </div>

        <div>
          <h4>全局状态区域</h4>
          <GlobalCounter title="Global 1" />
          <GlobalCounter title="Global 2" />
        </div>
      </div>
    </div>
  )
}
