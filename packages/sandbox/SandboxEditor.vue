<template>
  <!-- <FileSelector/> -->
  <div class="sfc-sandbox__editor">
    <header class="editor-header">
      <div class="editor-header__left">{{ sfcFilename }}</div>
    </header>
    <main class="editor-container">
      <Codemirror v-model="activeCode" :mode="activeMode" />
      <!-- <Message :err="fileErrors" /> -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, inject, Ref, watch } from 'vue'

// import FileSelector from './FileSelector.vue'
import Codemirror from '../components/codemirror/index.vue'
// import Message from './Message.vue'
import { compileModules, addFile, changeFile } from 'vue-sfc2esm'
// import { compileModules, addFile, changeFile } from '../plugins/vue-sfc2esm.esm' // for local test
import { debounce } from './utils'
import { ES_MODULES, IS_LOADING_PREVIEW, SHARED_CODE } from './types'

const props = defineProps({
  sfcFilename: { type: String, default: 'App.vue' },
  sfcCode: { type: String, default: '' }
})

const isLoading = inject(IS_LOADING_PREVIEW) as Ref<boolean>
const esModules = inject(ES_MODULES) as Ref<Array<string>>
const sharedCode = inject(SHARED_CODE) as Ref<string>

const onChange = debounce(async (code: string) => {
  sharedCode.value = code
  isLoading.value = true
  esModules.value = []
  changeFile(props.sfcFilename, code)
  const modules = await compileModules(props.sfcFilename)
  esModules.value = modules
  isLoading.value = false
}, 250)

const activeCode = ref(props.sfcCode)
const activeMode = computed(() => (props.sfcFilename.endsWith('.vue') ? 'htmlmixed' : 'javascript'))

watch(
  () => props.sfcCode,
  (newVal) => (activeCode.value = newVal)
)

watch(
  () => activeCode.value,
  (newVal) => onChange(newVal),
  {
    immediate: true
  }
)

onMounted(() => {
  if (props.sfcCode !== '') {
    addFile(props.sfcFilename, props.sfcCode)
    activeCode.value = props.sfcCode
  }
})
</script>

<style lang="scss" scoped>
.sfc-sandbox__editor {
  height: 100%;
  .editor-header {
    box-sizing: border-box;
    display: flex;
    height: 40px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--sfc-sandbox-bg-color);
    border-bottom: 1px solid var(--sfc-sandbox-border-color);
    .editor-header__left {
      padding: 10px 12px;
      font-weight: 500;
    }
  }
  .editor-container {
    height: calc(100% - 40px);
    overflow: hidden;
    position: relative;
  }
}
</style>
