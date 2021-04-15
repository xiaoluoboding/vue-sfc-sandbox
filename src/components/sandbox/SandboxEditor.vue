<template>
  <!-- <FileSelector/> -->
  <div class="editor-container">
    <CodeMirror @change="onChange" :value="activeCode" :mode="activeMode" />
    <Message :err="store.errors[0]" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue'

// import FileSelector from './FileSelector.vue'
import CodeMirror from './codemirror/index.vue'
import Message from './Message.vue'
import { store } from '../../plugins/sfc2esm.esm'
import { debounce } from './utils'

const props = defineProps({
  sfcCode: { type: String, default: '' }
})

const onChange = debounce((code: string) => {
  store.activeFile.code = code
}, 250)

const activeCode = ref(store.activeFile.code)
const activeMode = computed(
  () => (store.activeFilename.endsWith('.vue') ? 'htmlmixed' : 'javascript')
)

onMounted(() => {
  if (props.sfcCode !== '') {
    onChange(props.sfcCode)
    activeCode.value = props.sfcCode
  }
})
</script>

<style scoped>
.editor-container {
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
