import ValtioStore from '@empjs/valtio-store'

export class PerfRefStore extends ValtioStore {
  count = 0
  bigData: {value: number} | undefined = undefined

  getInitialState() {
    return {count: 0}
  }
}

export class PerfBatchStore extends ValtioStore {
  a = 0
  b = 0

  getInitialState() {
    return {a: 0, b: 0}
  }
}

export class PerfFineGrainedStore extends ValtioStore {
  count = 0
  name = ''

  getInitialState() {
    return {count: 0, name: ''}
  }

  increment() {
    this.count++
  }
}
