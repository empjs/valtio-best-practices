import type {Locale} from '../i18n/translations'
import {collectionsSnippet, collectionsSnippetEn} from './collections.snippet'
import {createStoreSnippet, createStoreSnippetEn} from './createStore.snippet'
import {performanceSnippet, performanceSnippetEn} from './performance.snippet'
import {subscribeSnippet, subscribeSnippetEn} from './subscribe.snippet'
import {useStoreSnippet, useStoreSnippetEn} from './useStore.snippet'

export {collectionsSnippet} from './collections.snippet'
export {createStoreSnippet} from './createStore.snippet'
export {performanceSnippet} from './performance.snippet'
export {subscribeSnippet} from './subscribe.snippet'
export {useStoreSnippet} from './useStore.snippet'

export function getCreateStoreSnippet(locale: Locale) {
  return locale === 'zh' ? createStoreSnippet : createStoreSnippetEn
}
export function getUseStoreSnippet(locale: Locale) {
  return locale === 'zh' ? useStoreSnippet : useStoreSnippetEn
}
export function getCollectionsSnippet(locale: Locale) {
  return locale === 'zh' ? collectionsSnippet : collectionsSnippetEn
}
export function getSubscribeSnippet(locale: Locale) {
  return locale === 'zh' ? subscribeSnippet : subscribeSnippetEn
}
export function getPerformanceSnippet(locale: Locale) {
  return locale === 'zh' ? performanceSnippet : performanceSnippetEn
}
