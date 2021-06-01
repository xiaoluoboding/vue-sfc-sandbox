export interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
}

export const packages: PackageManifest[] = [
  {
    name: 'vue-sfc-sandbox',
    display: 'VueSfcSandbox',
    description: 'Vue SFC Sandbox built on top of `@vue/compiler-sfc`, Sandbox as a Vue 3 component.',
    external: [
      'monaco-editor',
      'splitpanes',
      'vue',
      'vue-sfc2esm',
      'windicss',
      '@vue/compiler-sfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser',
      'consolidate'
    ],
    globals: {
      'monaco-editor': 'MonacoEditor',
      splitpanes: 'SplitPanes',
      vue: 'Vue',
      'vue-sfc2esm': 'VueSfc2esm',
      windicss: 'Windicss',
      '@vue/compiler-sfc': 'CompilerSfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser': 'CompilerSfcEsm',
      consolidate: 'Consolidate'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
