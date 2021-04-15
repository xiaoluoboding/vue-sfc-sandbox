import { InjectionKey } from 'vue'

export type ImportsMap = Record<string, any>
export const IMPORTS_MAP_KEY: InjectionKey<ImportsMap> = Symbol()
export const CDN_LIST_KEY: InjectionKey<Array<string>> = Symbol()
