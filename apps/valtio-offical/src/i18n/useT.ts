import {localeStore} from '../stores/localeStore'
import type {Locale} from './translations'
import {translations} from './translations'

/** 根据当前 locale 取文案，未找到 key 时返回 key 本身 */
export function useT(): (key: string) => string {
  const snap = localeStore.useSnapshot()
  const locale = snap.locale as Locale
  const dict = translations[locale] ?? translations.zh
  return (key: string) => dict[key] ?? key
}
