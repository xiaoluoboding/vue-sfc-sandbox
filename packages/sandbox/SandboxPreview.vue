<template>
  <div class="sfc-sandbox__preview">
    <header class="preview-header">
      <div class="preview-header__left">
        Preview
      </div>
      <div class="preview-header__right">
        <!-- fullpage icon -->
        <a href="javascript:;" @click="toggleFullpage">
          <template v-if="isFullpage">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10.704V13.5a.5.5 0 1 0 1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0 0 1h2.79l-3.144 3.147a.5.5 0 1 0 .708.706L6 10.703zm4-5.411V2.5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5h4a.5.5 0 1 0 0-1h-2.793l3.147-3.146a.5.5 0 0 0-.708-.708L10 5.293zM13 9.5a.5.5 0 1 1 1 0v4a.5.5 0 0 1-.5.5h-4a.5.5 0 1 1 0-1H13V9.5zm-10-3a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H3v3.5z" fill="#666" fill-rule="evenodd"/>
            </svg>
          </template>
          <template v-else>
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12.293V9.5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5h4a.5.5 0 1 0 0-1H3.707l3.147-3.146a.5.5 0 1 0-.708-.708L3 12.293zm10-8.586V6.5a.5.5 0 1 0 1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0 0 1h2.793L9.147 6.146a.5.5 0 1 0 .707.708L13 3.707zM13 9.5a.5.5 0 1 1 1 0v4a.5.5 0 0 1-.5.5h-4a.5.5 0 1 1 0-1H13V9.5zm-10-3a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H3v3.5z" fill="#666" fill-rule="evenodd"/>
            </svg>
          </template>
        </a>
      </div>
    </header>
    <main class="preview-container" ref="container">
      <LoadingMask v-if="isLoadingPreview" />
    </main>
    <footer>
      <Message :err="runtimeError || fileErrors" />
      <Message v-if="!runtimeError" :warn="runtimeWarning" />
    </footer>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ref,
  onMounted,
  onUnmounted,
  watchEffect,
  inject,
  toRaw,
  defineProps,
  computed,
  watch
} from 'vue'
import type { WatchStopHandle, Ref } from 'vue'

import Message from './Message.vue'
import LoadingMask from '../components/LoadingMask.vue'
import srcdoc from './srcdoc.html'
import { ReplProxy } from './ReplProxy'
import { store } from 'vue-sfc2esm'
// import { store } from '../plugins/vue-sfc2esm.esm'
import {
  IMPORT_MAPS_KEY,
  EXTERNALS_KEY,
  IS_LOADING_PREVIEW,
  IS_RESIZED,
  IS_FULLPAGE,
  ES_MODULES
} from './types'
import type { ImportMaps } from './types'
import { debounce } from './utils'

let sandbox: HTMLIFrameElement
let proxy: ReplProxy
let stopUpdateWatcher: WatchStopHandle

const UUID = btoa(Date.now().toString())
const importMaps = inject(IMPORT_MAPS_KEY)
const externals = inject(EXTERNALS_KEY)
const isLoadingPreview = inject(IS_LOADING_PREVIEW) as Ref<boolean>
const isResized = inject(IS_RESIZED) as Ref<boolean>
const isFullpage = inject(IS_FULLPAGE) as Ref<boolean>
const esModules = inject(ES_MODULES) as Ref<Array<string>>

const props = defineProps({
  sfcFilename: { type: String, default: 'App.vue' },
  sfcCode: { type: String, default: '' }
})

const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()

const fileErrors = computed(() => store.files[props.sfcFilename]?.compiled?.errors[0])

watch(
  () => isResized.value,
  (newVal) => {
    if (newVal) {
      recreateSandbox()
    }
  }
)

watch(
  () => runtimeError.value,
  (newVal) => {
    if (newVal) {
      isLoadingPreview.value = false
    }
  }
)

const onResize = debounce(recreateSandbox, 333)

const toggleFullpage = () => {
  // deleteFile(props.sfcFilename)
  isFullpage.value = !isFullpage.value
  // addFile(props.sfcFilename, props.sfcCode)
  // recreateSandbox()
}

// create sandbox on mounted
onMounted(() => {
  createSandbox()
  window.addEventListener('resize', onResize, false)
})

// destroy sandbox on unmounted
onUnmounted(() => {
  destroySandbox()
  window.removeEventListener('resize', onResize, false)
})

function destroySandbox () {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
}

function recreateSandbox () {
  destroySandbox()
  createSandbox()
}

const loadImportMap = () => {
  const importMap = JSON.parse(store.importMap || '{}') as ImportMaps

  if (!importMap.imports) {
    importMap.imports = {}
  }

  importMap.imports.vue = 'https://cdn.jsdelivr.net/npm/vue@next/dist/vue.runtime.esm-browser.js'

  if (importMaps) {
    Object.keys(importMaps).forEach(key => {
      if (!importMap.imports[key]) {
        importMap.imports[key] = importMaps[key]
      }
    })
  }

  return importMap
}

function createSandbox () {
  if (sandbox) {
    // clear prev sandbox
    destroySandbox()
    container.value.removeChild(sandbox)
  }

  sandbox = document.createElement('iframe')
  sandbox.setAttribute('id', UUID)
  sandbox.setAttribute('sandbox', [
    'allow-forms',
    'allow-modals',
    'allow-pointer-lock',
    'allow-popups',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation-by-user-activation'
  ].join(' '))

  const importMap = loadImportMap()

  const sandboxSrc = srcdoc.replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
  sandbox.srcdoc = sandboxSrc
  container.value.appendChild(sandbox)
  // sandbox.removeAttribute('srcdoc')

  proxy = new ReplProxy(sandbox, {
    on_fetch_progress: () => {
      // pending_imports = progress;
    },
    on_error: (event: any) => {
      const msg = event.value instanceof Error ? event.value.message : event.value
      if (
        msg.includes('Failed to resolve module specifier') ||
        msg.includes('Error resolving module specifier')
      ) {
        runtimeError.value = msg.replace(/\. Relative references must.*$/, '') +
        // '.\nTip: add an "import-map.json" file to specify import paths for dependencies.'
        '.\nTip: specify import paths for dependencies in [imports-map] props on sandbox components'
      } else {
        runtimeError.value = event.value
      }
    },
    on_unhandled_rejection: (event: any) => {
      let error = event.value
      if (typeof error === 'string') {
        error = { message: error }
      }
      runtimeError.value = 'Uncaught (in promise): ' + error.message
    },
    on_console: (log: any) => {
      if (log.level === 'error') {
        if (log.args[0] instanceof Error) {
          runtimeError.value = log.args[0].message
        } else {
          runtimeError.value = log.args[0]
        }
      } else if (log.level === 'warn') {
        if (log.args[0].toString().includes('[Vue warn]')) {
          runtimeWarning.value = log.args
            .join('')
            .replace(/\[Vue warn\]:/, '')
            .trim()
        }
      }
    },
    on_console_group: (action: any) => {
      // group_logs(action.label, false);
    },
    on_console_group_end: () => {
      // ungroup_logs();
    },
    on_console_group_collapsed: (action: any) => {
      // group_logs(action.label, true);
    }
  })

  sandbox.addEventListener('load', () => {
    proxy.handle_links()
    stopUpdateWatcher = watchEffect(updatePreview)
  })
}

async function updatePreview () {
  console.clear()
  runtimeError.value = null
  runtimeWarning.value = null

  try {
    isLoadingPreview.value = true
    // const modules = await compileModules(props.sfcFilename)
    const modules = toRaw(esModules.value)

    if (externals && externals.length > 0) {
      await proxy.evalCDN(externals, UUID)
    }

    if (modules && modules.length > 0) {
      await proxy.evalESM(modules, UUID)
    }
    isLoadingPreview.value = false
  } catch (e) {
    console.log(e)
    isLoadingPreview.value = false
    runtimeError.value = e.message
  }
}
</script>

<style lang="scss">
.sfc-sandbox__preview,
iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}

.sfc-sandbox__preview {
  .preview-header {
    box-sizing: border-box;
    display: flex;
    height: 40px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background-color: var(--sfc-sandbox-bg-color);
    border-bottom: 1px solid var(--sfc-sandbox-border-color);
    .preview-header__left {
      padding: 10px 12px;
      font-weight: 500;
    }
    .preview-header__right {
      padding: 8px 12px;
    }
  }
  .preview-container {
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
    border: none;
    background-color: #fff;
  }
}
</style>
