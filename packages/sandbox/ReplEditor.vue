<template>
  <div class="sfc-sandbox__editor">
    <header class="editor-header">
      <div class="editor-header__left">{{ sfcFilename }}</div>
      <div class="editor-header__right">
        <div class="actions" @click="toggleTheme">
          <svg viewBox="0 0 1024 1024" width="16" height="16" class="darkmode" :class="{ 'light': !isDarkmode, 'dark': isDarkmode }">
            <path d="M512 938.666667c235.648 0 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667z m0-64v-725.333334a362.666667 362.666667 0 0 1 0 725.333334z" fill="#666"></path>
          </svg>
        </div>
      </div>
    </header>
    <main class="editor-container">
      <!-- <Codemirror v-model="activeCode" :mode="activeMode" /> -->
      <Monaco v-model="activeCode" language="html" />
      <!-- <Message :err="fileErrors" /> -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, inject, Ref, watch } from 'vue'

// import Codemirror from '../components/codemirror/index.vue'
import Monaco from '../components/monaco/index.vue'
// import Message from './Message.vue'
import { compileModules, addFile, changeFile } from 'vue-sfc2esm'
// import { compileModules, addFile, changeFile } from '../plugins/vue-sfc2esm.esm' // for local test
import { debounce } from './utils'
import { IS_DARKMODE, ES_MODULES, IS_LOADING_PREVIEW, SHARED_CODE } from './types'

const props = defineProps({
  sfcFilename: { type: String, default: 'App.vue' },
  sfcCode: { type: String, default: '' },
  language: { type: String, default: 'javascript' }
})

const isLoading = inject(IS_LOADING_PREVIEW) as Ref<boolean>
const esModules = inject(ES_MODULES) as Ref<Array<string>>
const sharedCode = inject(SHARED_CODE) as Ref<string>
const isDarkmode = inject(IS_DARKMODE) as Ref<boolean>

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

const toggleTheme = () => {
  isDarkmode.value = !isDarkmode.value
}

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
    height: 32px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--sfc-sandbox-bg-color);
    border-bottom: 1px solid var(--sfc-sandbox-border-color);
    .editor-header__left {
      padding: 10px 12px;
      font-weight: 500;
    }
    .editor-header__right {
      .actions {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        &:hover {
          background-color: var(--sfc-sandbox-bg-color-66);
        }
        .darkmode {
          transition: all 0.3s ease-in;
        }
        .darkmode.light {
          transform: rotate(540deg);
        }
      }
    }
  }
  .editor-container {
    height: calc(100% - 32px);
    overflow: hidden;
    position: relative;
  }
}
</style>
