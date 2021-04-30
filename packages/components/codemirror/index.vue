<template>
  <div class="codemirror-container" ref="el"></div>
</template>

<script>
import { computed, defineComponent, inject, onMounted, onUnmounted, reactive, toRefs, watch } from 'vue'
import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, defaultTabBinding } from '@codemirror/commands'
import { defaultHighlightStyle } from '@codemirror/highlight'
// import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { debounce } from '../../sandbox/utils.ts'
import { IS_DARKMODE } from '../../sandbox/types.ts'

// interface EditorStore {
//   el: Element,
//   doc: string,
//   view: typeof EditorView
// }

export default defineComponent({
  name: 'Codemirror',

  props: ['modelValue'],

  setup (props, { emit }) {
    const { modelValue } = toRefs(props)

    const isDarkmode = inject(IS_DARKMODE)

    const store = reactive({
      el: null,
      doc: modelValue.value,
      view: null,
      theme: computed(() => isDarkmode.value ? oneDark : defaultHighlightStyle.fallback)
    })

    const initEditor = () => {
      const onUpdate = () => {
        return EditorView.updateListener.of(debounce(({ state }) => {
          store.doc = state.doc.toString()
          emit('update:modelValue', store.doc)
        }))
      }

      const tabBinding = () => {
        return [
          keymap.of([...defaultKeymap, defaultTabBinding]),
          EditorState.tabSize.of(2)
        ]
      }

      const editorState = EditorState.create({
        doc: store.doc,
        extensions: [
          basicSetup,
          // javascript(),
          store.theme,
          html(),
          onUpdate(),
          tabBinding()
        ]
      })

      store.view = new EditorView({
        state: editorState,
        parent: store.el
      })
    }

    const disposeEditor = () => {
      store.view.destroy()
    }

    const recreateEditor = () => {
      disposeEditor()
      initEditor()
    }

    watch(
      () => isDarkmode.value,
      () => (recreateEditor())
    )

    onMounted(initEditor)

    onUnmounted(disposeEditor)

    return {
      ...toRefs(store)
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.css';
.codemirror-container {
  height: 100%;
  overflow-y: auto;
}
</style>
