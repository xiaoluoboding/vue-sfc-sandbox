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
      const editorInstance = monaco.editor.create(
        editorRef.value,
        {
          value: sfcCode.value,
          language: language.value,
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
