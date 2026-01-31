import {createStore} from '@empjs/valtio'

export type Locale = 'zh' | 'en'

/** 全局语言 store，默认中文，持久化到 localStorage */
export const localeStore = createStore({locale: 'zh' as Locale}, {name: 'LocaleStore', devtools: true})
localeStore.persist('valtio-locale')
