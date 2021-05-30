import { watch, Ref, unref, onMounted } from 'vue'
// import { createEventHook, tryOnUnmounted } from '@vueuse/core'
import setupMonaco from './editor'
// import { isDark } from './dark'

export function useMonaco(target: Ref, options: any) {
  const init = async() => {
    const { monaco } = await setupMonaco()

    const stop = watch(target, () => {
      const el = unref(target)

      if (!el)
        return

      const extension = () => {
        if (options.language === 'typescript')
          return 'ts'
        else if (options.language === 'javascript')
          return 'js'
        else if (options.language === 'html')
          return 'html'
      }

      const model = monaco.editor.createModel(
        options.code,
        options.language,
        monaco.Uri.parse(`file:///root/${Date.now()}.${extension()}`)
      )
      const editor = monaco.editor.create(el, {
        model,
        tabSize: 2,
        insertSpaces: true,
        autoClosingQuotes: 'always',
        detectIndentation: false,
        folding: false,
        automaticLayout: true,
        theme: 'vs-light',
        minimap: {
          enabled: false,
        },
      })

      // watch(isDark, () => {
      //   if (isDark.value)
      //     monaco.editor.setTheme('vs-dark')
      //   else
      //     monaco.editor.setTheme('vs-light')
      // }, { immediate: true })

      editor.onDidChangeModelContent(() => {
        const value = editor.getValue()
      })
    }, {
      flush: 'post',
      immediate: true,
    })

  }

  init()

  onMounted(() => stop())

  return {
    onChange
  }
}
