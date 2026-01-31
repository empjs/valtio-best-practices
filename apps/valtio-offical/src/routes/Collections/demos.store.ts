import {createMap, createSet, createStore} from '@empjs/valtio'

// 全局集合 store：供「跨组件共享」示例使用
export const collectionsStore = createStore(
  {
    map: createMap<string, number>([
      ['a', 1],
      ['b', 2],
    ]),
    tagSet: createSet<string>(['x']),
  },
  {name: 'CollectionsStore'},
)
