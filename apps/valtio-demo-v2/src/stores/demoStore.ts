import {createStore} from '@empjs/valtio'

/** 供 createStore 用法页展示「跨组件共享」的最小全局 store */
export const demoStore = createStore({count: 0}, {devtools: true})
