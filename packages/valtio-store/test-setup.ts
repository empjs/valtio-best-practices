/**
 * Bun 测试预加载：注册 happy-dom，提供 document/window 供 React Testing Library 使用
 */
import {GlobalRegistrator} from '@happy-dom/global-registrator'

GlobalRegistrator.register()
