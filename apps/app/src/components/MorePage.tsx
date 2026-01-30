import React from 'react'
import {CloneDemo} from './CloneDemo'
import {MapSetDemo} from './MapSetDemo'
import {PersistDemo} from './PersistDemo'

export function MorePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <MapSetDemo />
        <PersistDemo />
      </div>
      <div className="space-y-6">
        <CloneDemo />
      </div>
    </div>
  )
}
