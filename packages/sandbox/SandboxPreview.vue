<template>
  <div class="sfc-sandbox__preview" ref="container"></div>
  <Message :err="runtimeError" />
  <Message v-if="!runtimeError" :warn="runtimeWarning" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Message from './Message.vue'
import { ref, onMounted, onUnmounted, watchEffect, inject, toRaw } from 'vue'
import type { WatchStopHandle, Ref } from 'vue'

import srcdoc from './srcdoc.html'
import { ReplProxy } from './ReplProxy'
import { store, generateHashId } from 'vue-sfc2esm'
import { IMPORT_MAPS_KEY, EXTERNALS_KEY, IS_LOADING_PREVIEW, ES_MODULES } from './types'
import type { ImportMaps } from './types'

const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()
const uuid = ref(generateHashId(new Date().toString()))

let sandbox: HTMLIFrameElement
let proxy: ReplProxy
let stopUpdateWatcher: WatchStopHandle

const importMaps = inject(IMPORT_MAPS_KEY)
const externals = inject(EXTERNALS_KEY)
const isLoadingPreview = inject(IS_LOADING_PREVIEW) as Ref<boolean>
const esModules = inject(ES_MODULES) as Ref<Array<string>>

// create sandbox on mount
onMounted(createSandbox)

onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})

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
    proxy.destroy()
    stopUpdateWatcher()
    container.value.removeChild(sandbox)
  }

  sandbox = document.createElement('iframe')
  sandbox.setAttribute('id', uuid.value)
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
      await proxy.evalCDN(externals, uuid.value)
    }

    if (modules && modules.length > 0) {
      await proxy.evalESM(modules, uuid.value)
    }
    isLoadingPreview.value = false
  } catch (e) {
    console.log(e)
    isLoadingPreview.value = false
    runtimeError.value = e.message
  }
}
</script>

<style>
.sfc-sandbox__preview,
iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
</style>
