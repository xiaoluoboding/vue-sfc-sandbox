<template>
  <div ref="editorRef" style="height: 100%; width: 100%;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRef, inject, watch, Ref } from 'vue'
import setupMonaco from './editor'

import { IS_DARKMODE } from '../../sandbox/types'

export default defineComponent({
  name: 'MonacoEditor',

  props: {
    modelValue: { type: String, default: '' },
    language: { type: String, default: 'javascript' }
  },

  setup (props, { emit }) {
    const editorRef = ref()
    const sfcCode = toRef(props, 'modelValue')
    const language = toRef(props, 'language')

    const isDarkmode = inject(IS_DARKMODE) as Ref<boolean>

    const init = async () => {
      const { monaco } = await setupMonaco()

      const extension = () => {
        if (language.value === 'typescript') {
          return 'ts'
        } else if (language.value === 'javascript') {
          return 'js'
        } else if (language.value === 'html') {
          return 'html'
        }
      }

      const model = monaco.editor.createModel(
        sfcCode.value,
        language.value,
        monaco.Uri.parse(`file:///root/${Date.now()}.${extension()}`)
      )

      const editorInstance = monaco.editor.create(
        editorRef.value,
        {
          model,
          tabSize: 2,
          insertSpaces: true,
          autoClosingQuotes: 'always',
          detectIndentation: false,
          folding: false,
          automaticLayout: true,
          theme: 'vs-light',
          minimap: {
            enabled: false
          }
        }
      )

      watch(
        () => isDarkmode.value,
        (val) => {
          // TODO not support have multiple editors of different themes.
          monaco.editor.setTheme(val ? 'vs-dark' : 'vs-light')
        },
        { immediate: true }
      )

      editorInstance.onDidChangeModelContent(() => {
        const value = editorInstance.getValue()
        emit('update:modelValue', value)
      })
    }

    onMounted(init)

    return {
      editorRef
    }
  }
})
</script>
