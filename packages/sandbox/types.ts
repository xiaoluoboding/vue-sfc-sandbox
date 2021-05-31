import { InjectionKey } from 'vue'
import type { Ref } from 'vue'

export type ImportMaps = Record<string, any>
export type PanesInfo = Array<Record<string, number>>

export const IMPORT_MAPS_KEY: InjectionKey<ImportMaps> = Symbol()
export const EXTERNALS_KEY: InjectionKey<Array<string>> = Symbol()
export const IS_LOADING_PREVIEW: InjectionKey<Ref<boolean>> = Symbol()
export const IS_RESIZED: InjectionKey<Ref<boolean>> = Symbol()
export const ES_MODULES: InjectionKey<Ref<Array<string>>> = Symbol()

export const IS_FULLPAGE: InjectionKey<Ref<boolean>> = Symbol()
export const SHARED_CODE: InjectionKey<Ref<string>> = Symbol()
export const IS_DARKMODE: InjectionKey<Ref<boolean>> = Symbol()
export const WINDI_CSS: InjectionKey<Ref<string>> = Symbol()
