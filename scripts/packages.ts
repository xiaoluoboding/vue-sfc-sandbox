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
      'codemirror',
      'consolidate'
    ],
    globals: {
      codemirror: 'CodeMirror'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
