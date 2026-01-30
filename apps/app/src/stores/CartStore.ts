import ValtioStore from '@empjs/valtio-store'

export interface CartItem {
  id: number
  name: string
  price: number
}

export class CartStore extends ValtioStore {
  items: CartItem[] = []

  getInitialState() {
    return {items: []}
  }

  addItem(item: Omit<CartItem, 'id'>) {
    this.items.push({...item, id: Date.now() + Math.random()})
  }

  removeItem(id: number) {
    const index = this.items.findIndex(i => i.id === id)
    if (index !== -1) this.items.splice(index, 1)
  }
}
