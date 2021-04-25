<template>
  <div class="codemirror-container" ref="el"></div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup'
// import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
// import { oneDark } from '@codemirror/theme-one-dark'
import { debounce } from '../../sandbox/utils'

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

    const store = reactive({
      el: null,
      doc: modelValue.value,
      view: null
    })

    onMounted(() => {
      const onUpdate = () =>
        EditorView.updateListener.of(debounce(({ state }) => {
          store.doc = state.doc.toString()
          emit('update:modelValue', store.doc)
        }))

      const editorState = EditorState.create({
        doc: store.doc,
        extensions: [
          basicSetup,
          // oneDark,
          // javascript(),
          html(),
          onUpdate()
        ]
      })

      store.view = new EditorView({
        state: editorState,
        parent: store.el
      })
    })

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
