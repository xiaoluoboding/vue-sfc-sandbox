import { getCurrentInstance, onMounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { store } from 'vue-sfc2esm'
/* __imports__ */

import vueTypes from '@vue/runtime-core/dist/runtime-core.d.ts'

const setup = async () => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    noUnusedLocals: false,
    noUnusedParameters: false,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    strict: false,
    allowJs: true,
  })

  const registered: string[] = ['vue']

  monaco.languages.typescript.typescriptDefaults.addExtraLib(`
    declare module 'vue' { ${vueTypes} }
  `, 'ts:vue')

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

  await Promise.all([
    // load workers
    (async() => {
      const [
        { default: EditorWorker },
        { default: JsonWorker },
        { default: CssWorker },
        { default: HtmlWorker },
        { default: TsWorker },
      ] = await Promise.all([
        import('monaco-editor/esm/vs/editor/editor.worker'),
        import('monaco-editor/esm/vs/language/json/json.worker'),
        import('monaco-editor/esm/vs/language/css/css.worker'),
        import('monaco-editor/esm/vs/language/html/html.worker'),
        import('monaco-editor/esm/vs/language/typescript/ts.worker'),
      ])

      // @ts-expect-error
      window.MonacoEnvironment = {
        getWorker(_: any, label: string) {
          if (label === 'json')
            return new JsonWorker()
          if (label === 'css' || label === 'scss' || label === 'less')
            return new CssWorker()
          if (label === 'html' || label === 'handlebars' || label === 'razor')
            return new HtmlWorker()
          if (label === 'typescript' || label === 'javascript')
            return new TsWorker()
          return new EditorWorker()
        },
      }
    })(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const injection_arg = monaco

  /* __async_injections__ */

  if (getCurrentInstance())
    await new Promise<void>(resolve => onMounted(resolve))

  return { monaco }
}

export default setup

setup()
