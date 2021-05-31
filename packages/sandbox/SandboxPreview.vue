<template>
  <div class="sfc-sandbox__preview">
    <header class="preview-header">
      <div class="preview-header__left">
        Preview
      </div>
      <div class="preview-header__right">
        <div class="actions" @click="toggleTheme">
          <!-- darkmode icon -->
          <svg width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" style="vertical-align: middle; transform: translateY(-5%);" v-if="isDarkmode">
            <path d="M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3z" fill="currentColor"></path>
          </svg>
          <svg width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" style="vertical-align: middle; transform: translateY(-5%);" v-else>
            <path d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6z" fill="currentColor"></path>
            <path d="M5.394 6.813l1.414-1.415l3.506 3.506L8.9 10.318z" fill="currentColor"></path>
            <path d="M2 15.005h5v2H2z" fill="currentColor"></path>
            <path d="M5.394 25.197L8.9 21.691l1.414 1.415l-3.506 3.505z" fill="currentColor"></path>
            <path d="M15 25.005h2v5h-2z" fill="currentColor"></path>
            <path d="M21.687 23.106l1.414-1.415l3.506 3.506l-1.414 1.414z" fill="currentColor"></path>
            <path d="M25 15.005h5v2h-5z" fill="currentColor"></path>
            <path d="M21.687 8.904l3.506-3.506l1.414 1.415l-3.506 3.505z" fill="currentColor"></path>
            <path d="M15 2.005h2v5h-2z" fill="currentColor"></path>
          </svg>
        </div>
        <!-- fullpage icon -->
        <div class="actions" @click="toggleFullpage">
          <template v-if="isFullpage">
            <svg class="iconify iconify--mdi" width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="transform: rotate(360deg);"><path d="M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z" fill="currentColor"></path></svg>
          </template>
          <template v-else>
            <svg class="iconify iconify--mdi" width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="transform: rotate(360deg);"><path d="M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3z" fill="currentColor"></path></svg>
          </template>
        </div>
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
  ES_MODULES,
  IS_DARKMODE,
  WINDI_CSS
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
const isDarkmode = inject(IS_DARKMODE) as Ref<boolean>
const esModules = inject(ES_MODULES) as Ref<Array<string>>
const windicss = inject(WINDI_CSS) as Ref<string>

const props = defineProps({
  sfcFilename: { type: String, default: 'App.vue' },
  sfcCode: { type: String, default: '' }
})

const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()

const fileErrors = computed(() => {
  return store.files && store.files[props.sfcFilename] && store.files[props.sfcFilename].compiled.errors[0]
})

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
  if (isFullpage.value) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
  // addFile(props.sfcFilename, props.sfcCode)
  // recreateSandbox()
}

const toggleTheme = () => {
  isDarkmode.value = !isDarkmode.value
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

  importMap.imports.vue = 'https://cdn.skypack.dev/vue@next/dist/vue.esm-browser.js'
  // importMap.imports.vue = 'https://cdn.jsdelivr.net/npm/vue@3.1.0-beta.1/dist/vue.esm-browser.js'

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
  // console.clear()
  runtimeError.value = null
  runtimeWarning.value = null

  const toggleDark = isDarkmode.value
    ? `
document.querySelector("html").classList.add("dark");
document.getElementById('__windi-styles').innerHTML = ${JSON.stringify(windicss.value)}
`
    : `
document.querySelector("html").classList.remove("dark");
document.getElementById('__windi-styles').innerHTML = ${JSON.stringify(windicss.value)}
`

  try {
    isLoadingPreview.value = true
    // const modules = await compileModules(props.sfcFilename)
    const modules = toRaw(esModules.value)

    if (externals && externals.length > 0) {
      await proxy.evalCDN(externals, UUID)
    }

    if (modules && modules.length > 0) {
      await proxy.evalESM([...modules, toggleDark], UUID)
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
    height: 32px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background-color: var(--sfc-sandbox-header-bg-color);
    border-bottom: 1px solid var(--sfc-sandbox-border-color);
    color: var(--sfc-sandbox-header-text-color);
    .preview-header__left {
      padding: 10px 12px;
      font-weight: 500;
    }
    .preview-header__right {
      display: flex;
      justify-content: center;
      align-items: center;
      .actions {
        cursor: pointer;
        padding: 8px;
        &:hover {
          background-color: var(--sfc-sandbox-bg-color-66);
        }
      }
    }
  }
  .preview-container {
    position: relative;
    width: 100%;
    height: calc(100% - 32px);
    border: none;
    background-color: #fff;
  }
}
</style>
