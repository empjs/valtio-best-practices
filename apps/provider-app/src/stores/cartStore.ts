import ValtioStore from '@empjs/valtio-store'

export class CartItem {
  id: number
  name: string
  price: number

  constructor(options: {id: number; name: string; price: number} | {name: string; price: number}) {
    this.id = 'id' in options ? options.id : Date.now() + Math.random()
    this.name = options.name
    this.price = options.price
  }
}

export class CartStore extends ValtioStore {
  items: CartItem[] = []

  getInitialState() {
    return {items: [] as CartItem[]}
  }

  addItem(item: {name: string; price: number}) {
    this.items.push(new CartItem(item))
  }

  removeItem(id: number) {
    const index = this.items.findIndex(i => i.id === id)
    if (index !== -1) this.items.splice(index, 1)
  }
}
