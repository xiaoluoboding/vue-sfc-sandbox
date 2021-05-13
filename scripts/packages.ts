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
      'vue',
      '@codemirror/basic-setup',
      '@codemirror/commands',
      '@codemirror/highlight',
      '@codemirror/lang-html',
      '@codemirror/lang-javascript',
      '@codemirror/theme-one-dark',
      '@codemirror/view',
      '@vue/compiler-sfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser',
      'consolidate'
    ],
    globals: {
      vue: 'Vue',
      '@codemirror/basic-setup': 'CodeMirror',
      '@codemirror/commands': 'CodeMirrorCommands',
      '@codemirror/highlight': 'CodeMirrorHighlight',
      '@codemirror/lang-html': 'CodeMirrorLangHtml',
      '@codemirror/lang-javascript': 'CodeMirrorLangJavaScript',
      '@codemirror/theme-one-dark': 'CodeMirrorThemeOneDark',
      '@codemirror/view': 'CodeMirrorViews',
      '@vue/compiler-sfc': 'CompilerSfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser': 'CompilerSfcEsm',
      consolidate: 'Consolidate'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
