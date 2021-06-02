<template>
  <div class="sfc-sandbox__preview">
    <header class="preview-header">
      <div class="preview-header__left">
        Preview
      </div>
      <div class="preview-header__right">
        <Actions />
      </div>
    </header>
    <main class="preview-container" ref="container">
      <LoadingMask v-if="isLoadingPreview" />
      <footer>
        <Message :err="runtimeError || fileErrors" />
        <Message v-if="!runtimeError" :warn="runtimeWarning" />
      </footer>
    </main>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onUnmounted, watchEffect, inject, toRaw, computed, watch, defineComponent } from 'vue'
import type { WatchStopHandle, Ref } from 'vue'
import { store } from 'vue-sfc2esm'
// import { store } from '../plugins/vue-sfc2esm.esm'

import Message from './Message.vue'
import Actions from './Actions.vue'
import LoadingMask from '../../components/LoadingMask.vue'
import srcdoc from '../repl/srcdoc.html'
import { ReplProxy } from '../repl/ReplProxy'

import {
  IMPORT_MAPS_KEY,
  EXTERNALS_KEY,
  IS_LOADING_PREVIEW,
  IS_RESIZED,
  ES_MODULES,
  IS_DARKMODE,
  WINDI_CSS,
  ImportMaps
} from '../types'
import { debounce } from '../utils'

export default defineComponent({
  name: 'SandboxPreview',

  components: {
    Actions,
    Message,
    LoadingMask
  },

  props: {
    sfcFilename: { type: String, default: 'App.vue' },
    sfcCode: { type: String, default: '' }
  },

  setup (props) {
    let sandbox: HTMLIFrameElement
    let proxy: ReplProxy
    let stopUpdateWatcher: WatchStopHandle

    const UUID = btoa(Date.now().toString())
    const importMaps = inject(IMPORT_MAPS_KEY)
    const externals = inject(EXTERNALS_KEY)
    const isLoadingPreview = inject(IS_LOADING_PREVIEW) as Ref<boolean>
    const isResized = inject(IS_RESIZED) as Ref<boolean>
    const isDarkmode = inject(IS_DARKMODE) as Ref<boolean>
    const esModules = inject(ES_MODULES) as Ref<Array<string>>
    const windicss = inject(WINDI_CSS) as Ref<string>

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

      const applyStyles = isDarkmode.value
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
          await proxy.evalESM([...modules, applyStyles], UUID)
        }
        isLoadingPreview.value = false
      } catch (e) {
        console.log(e)
        isLoadingPreview.value = false
        runtimeError.value = e.message
      }
    }

    return {
      // ref
      container,
      // state
      fileErrors,
      isLoadingPreview,
      runtimeError,
      runtimeWarning
    }
  }
})
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
    padding: 0 12px;
    .preview-header__left {
      font-weight: 500;
    }
    .preview-header__right {
      display: flex;
      justify-content: center;
      align-items: center;
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
