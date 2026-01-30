import ValtioStore from '@empjs/valtio-store'

export class CounterStore extends ValtioStore {
  count = 0
  name = ''

  getInitialState() {
    return { count: 0, name: '' }
  }

  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }

  setName(name: string) {
    this.name = name
  }
}
