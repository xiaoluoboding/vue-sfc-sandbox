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
    name: 'sfc-sandbox',
    display: 'SfcSandbox',
    description: 'Compile Vue SFC File to ES Modules.',
    external: [
      'vue',
      '@codemirror/basic-setup',
      '@codemirror/lang-html',
      '@codemirror/lang-javascript',
      '@vue/compiler-sfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser',
      'consolidate'
    ],
    globals: {
      'vue': 'Vue',
      '@codemirror/basic-setup': 'CodeMirror',
      '@codemirror/lang-html': 'CodeMirrorLangHtml',
      '@codemirror/lang-javascript': 'CodeMirrorLangJavaScript',
      '@vue/compiler-sfc': 'CompilerSfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser': 'CompilerSfcEsm',
      'consolidate': 'Consolidate'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
