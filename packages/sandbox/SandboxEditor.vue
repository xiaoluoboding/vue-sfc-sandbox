<template>
  <!-- <FileSelector/> -->
  <div class="editor-container">
    <CodeMirror @change="onChange" :value="activeCode" :mode="activeMode" />
    <Message :err="store.errors[0]" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, inject, Ref } from 'vue'

// import FileSelector from './FileSelector.vue'
import CodeMirror from './codemirror/index.vue'
import Message from './Message.vue'
import { compileModules, store, addFile, changeFile } from '../plugins/sfc2esm.esm'
import { debounce } from './utils'
import { ES_MODULES, IS_LOADING_PREVIEW } from './types'

const props = defineProps({
  sfcFilename: { type: String, default: 'App.vue' },
  sfcCode: { type: String, default: '' }
})

const isLoading = inject(IS_LOADING_PREVIEW) as Ref<boolean>
const esModules = inject(ES_MODULES) as Ref<Array<string>>

const onChange = debounce(async (code: string) => {
  isLoading.value = true
  esModules.value = []
  changeFile(props.sfcFilename, code)
  const modules = await compileModules(props.sfcFilename)
  esModules.value = modules
  isLoading.value = false
}, 250)

const activeCode = ref(store.activeFile.code)
const activeMode = computed(() => (store.activeFilename.endsWith('.vue') ? 'htmlmixed' : 'javascript'))

onMounted(() => {
  if (props.sfcCode !== '') {
    addFile(props.sfcFilename, props.sfcCode)
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
