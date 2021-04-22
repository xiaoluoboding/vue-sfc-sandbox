import { InjectionKey, Ref } from 'vue'

export type ImportsMap = Record<string, any>
export const IMPORTS_MAP_KEY: InjectionKey<ImportsMap> = Symbol()
export const CDN_LIST_KEY: InjectionKey<Array<string>> = Symbol()
export const IS_LOADING_PREVIEW: InjectionKey<Ref<boolean>> = Symbol()
export const ES_MODULES: InjectionKey<Ref<Array<string>>> = Symbol()
