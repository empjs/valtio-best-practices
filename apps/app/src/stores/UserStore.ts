import ValtioStore from '@empjs/valtio-store'

export interface User {
  id: number
  name: string
  email: string
  phone: string
}

export class UserStore extends ValtioStore {
  user: User | null = null

  getInitialState() {
    return {user: null}
  }
}
