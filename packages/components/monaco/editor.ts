import * as monaco from 'monaco-editor'
/* __imports__ */
import vueTypes from './vue-runtime.types'
// import vueTypes from '@vue/runtime-core/dist/runtime-core.d.ts'

const setup = () => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    noUnusedLocals: false,
    noUnusedParameters: false,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    strict: false,
    allowJs: true
  })

  monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare module 'vue' { ${vueTypes} }
    `, 'js:vue'
  )

  monaco.languages.typescript.typescriptDefaults.addExtraLib(`
      declare module 'vue' { ${vueTypes} }
    `, 'ts:vue'
  )

  // const registered: string[] = ['vue']

  // watch(() => store.packages, () => {
  //   store.packages.forEach((pack) => {
  //     if (registered.includes(pack.name))
  //       return

  //     registered.push(pack.name)
  //     monaco.languages.typescript.typescriptDefaults.addExtraLib(`
  //       declare module '${pack.name}' {
  //         let x: any;
  //         export = x;
  //       }
  //     `, pack.name)
  //   })
  // }, { immediate: true })

  return { monaco }
}

export default setup
