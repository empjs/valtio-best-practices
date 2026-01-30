import React from 'react'
import {PerfBatchDemo} from './PerfBatchDemo'
import {PerfFineGrainedDemo} from './PerfFineGrainedDemo'
import {PerfRefDemo} from './PerfRefDemo'

export function PerfPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <PerfRefDemo />
        <PerfBatchDemo />
      </div>
      <div className="space-y-6">
        <PerfFineGrainedDemo />
      </div>
    </div>
  )
}
