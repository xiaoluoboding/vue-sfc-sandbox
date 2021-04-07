<template>
  <div class="sandbox--viewer" ref="container"></div>
  <Message :err="runtimeError" />
  <Message v-if="!runtimeError" :warn="runtimeWarning" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Message from './Message.vue'
import { ref, onMounted, onUnmounted, watchEffect, watch, nextTick } from 'vue'
import type { WatchStopHandle } from 'vue'
import srcdoc from './srcdoc.html'
import { ReplProxy } from './ReplProxy'
import { compileModules, store } from '../../plugins/index.esm'

const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()

let sandbox: HTMLIFrameElement
let proxy: ReplProxy
let stopUpdateWatcher: WatchStopHandle

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when import map changes
watch(() => store.importMap, (importMap, prev) => {
  if (!importMap) {
    if (prev) {
      // import-map.json deleted
      createSandbox()
    }
    return
  }
  try {
    const map = JSON.parse(importMap)
    if (!map.imports) {
      store.errors = [
        'import-map.json is missing "imports" field.'
      ]
      return
    }
    if (map.imports.vue) {
      store.errors = [
        'Select Vue versions using the top-right dropdown.\n' +
        'Specifying it in the import map has no effect.'
      ]
    }
    createSandbox()
  } catch (e) {
    store.errors = [e]
  }
})

// reset sandbox when version changes
// watch(vueRuntimeUrl, createSandbox)

onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})

function createSandbox () {
  if (sandbox) {
    // clear prev sandbox
    proxy.destroy()
    stopUpdateWatcher()
    container.value.removeChild(sandbox)
  }

  sandbox = document.createElement('iframe')
  sandbox.setAttribute('sandbox', [
    'allow-forms',
    'allow-modals',
    'allow-pointer-lock',
    'allow-popups',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation-by-user-activation'
  ].join(' '))

  let importMap: Record<string, any>
  try {
    // importMap = JSON.parse(store.importMap || '{}')
    importMap = {}
  } catch (e) {
    store.errors = [`Syntax error in import-map.json: ${e.message}`]
    return
  }

  if (!importMap.imports) {
    importMap.imports = {}
  }
  // const defaultVueUrl = process.env.NODE_ENV === 'production'
  //   ? 'https://sfc.vuejs.org/vue.runtime.esm-browser.js' // to be copied on build
  //   : `${location.origin}/src/components/sandbox/vue-dev-proxy.js`
  importMap.imports.vue = 'https://sfc.vuejs.org/vue.runtime.esm-browser.js'
  // importMap.imports.vue = 'https://unpkg.com/browse/vue@3.0.11/dist/vue.runtime.esm-browser.js'
  const sandboxSrc = srcdoc.replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
  sandbox.srcdoc = sandboxSrc
  container.value.appendChild(sandbox)

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
        '.\nTip: add an "import-map.json" file to specify import paths for dependencies.'
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
    const modules = await compileModules()
    // reset modules
    //     await proxy.eval([
    //       'window.__modules__ = {};window.__css__ = ""',
    //       ...modules,
    //       `
    // import { createApp as _createApp } from "vue"

    // if (window.__app__) {
    //   window.__app__.unmount()
    //   document.getElementById('app').innerHTML = ''
    // }

    // document.getElementById('__sfc-styles').innerHTML = window.__css__
    // const app = window.__app__ = _createApp(__modules__["${MAIN_FILE}"].default)
    // app.config.errorHandler = e => console.error(e)
    // app.mount('#app')`.trim()
    //     ])
    await proxy.eval(modules)
  } catch (e) {
    runtimeError.value = e.message
  }
}

nextTick(updatePreview)
</script>

<style>
.sandbox--viewer,
iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
</style>
