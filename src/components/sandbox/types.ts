import { InjectionKey, Ref } from 'vue'

export type ImportMaps = Record<string, any>
export const IMPORT_MAPS_KEY: InjectionKey<ImportMaps> = Symbol()
export const EXTERNALS_KEY: InjectionKey<Array<string>> = Symbol()
export const IS_LOADING_PREVIEW: InjectionKey<Ref<boolean>> = Symbol()
export const ES_MODULES: InjectionKey<Ref<Array<string>>> = Symbol()
