import { reactive, ref } from 'vue'
import { useDark } from '../composable/useDark'
import { ImportMaps } from './types'

export interface Store {
  isFullPage: boolean;
  isDarkmode: boolean;
  sharedCode: string;
  windicss: string;
  isScriptSetup?: boolean;
  isResized: boolean;
  isLoadingPreview: boolean;
  esModules: Array<string>;
  importMaps: ImportMaps;
  externals: Array<string>;
}

export const store: Store = reactive({
  isFullPage: ref(false),
  isDarkmode: useDark(),
  sharedCode: '',
  windicss: '',
  isScriptSetup: false,
  isResized: false,
  isLoadingPreview: false,
  esModules: [],
  importMaps: {},
  externals: []
})
