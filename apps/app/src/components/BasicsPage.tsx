import React from 'react'
import {AsyncStateDemo} from './AsyncStateDemo'
import {DerivedStateDemo} from './DerivedStateDemo'
import {GlobalStateDemo} from './GlobalStateDemo'
import {HistoryDemo} from './HistoryDemo'
import {LocalStateDemo} from './LocalStateDemo'
import {MixedDemo} from './MixedDemo'

export function BasicsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <LocalStateDemo />
        <GlobalStateDemo />
        <MixedDemo />
      </div>
      <div className="space-y-6">
        <HistoryDemo />
        <DerivedStateDemo />
        <AsyncStateDemo />
      </div>
    </div>
  )
}
