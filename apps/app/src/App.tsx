import React from 'react'
import {AsyncStateDemo} from './components/AsyncStateDemo'
import {DerivedStateDemo} from './components/DerivedStateDemo'
import {GlobalStateDemo} from './components/GlobalStateDemo'
import {HistoryDemo} from './components/HistoryDemo'
import {LocalStateDemo} from './components/LocalStateDemo'
import {MixedDemo} from './components/MixedDemo'
import {CounterStore, globalCounterStore} from './stores/CounterStore'

export default function App() {
  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b pb-4">EMP ValtioStore</h1>

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
    </div>
  )
}
