import { InjectionKey } from 'vue'

export const IMPORTS_MAP_KEY: InjectionKey<Record<string, unknown>> = Symbol()
export const CDN_LIST_KEY: InjectionKey<Array<string>> = Symbol()
