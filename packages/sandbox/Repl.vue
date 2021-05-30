<template>
  <splitpanes
    class="sandbox default-theme"
    :class="{ 'is-fullpage': isFullpage && isTeleport }"
    :style="sandboxStyles"
    @resized="handleResized"
  >
    <pane min-size="20">
      <splitpanes horizontal>
        <pane>
          <SandboxEditor :sfc-filename="sfcFilename" :sfc-code="sfcCode" mode="script" />
        </pane>
        <!-- <pane>
          <SandboxEditor :sfc-filename="sfcFilename" :sfc-code="sfcCode" mode="template" />
        </pane> -->
      </splitpanes>
    </pane>
    <pane max-size="80">
      <SandboxPreview :sfc-filename="sfcFilename" :sfc-code="sfcCode" v-show="esModules" />
    </pane>
  </splitpanes>
</template>

<script setup lang="ts">
import { computed, defineProps, nextTick, provide, ref, watch, inject, Ref } from 'vue'
// import SplitPane from '../components/SplitPane.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import SandboxEditor from './SandboxEditor.vue'
import SandboxPreview from './SandboxPreview.vue'

import {
  IMPORT_MAPS_KEY,
  EXTERNALS_KEY,
  IS_LOADING_PREVIEW,
  IS_RESIZED,
  IS_FULLPAGE,
  ES_MODULES,
  PanesInfo
} from './types'

const props = defineProps({
  // sandbox height unit (px)
  height: { type: Number, default: 400 },
  importMaps: { type: Object, default: () => ({}) },
  externals: { type: Array, default: () => ([]) },
  sfcFilename: { type: String, default: '' },
  sfcCode: { type: String, default: '' },
  isTeleport: { type: Boolean, default: false }
})

const isLoadingPreview = ref(false)
const isResized = ref(false)
// const isFullpage = ref(false)
const esModules = ref([])

provide(IMPORT_MAPS_KEY, props.importMaps)
provide(EXTERNALS_KEY, props.externals)
provide(IS_LOADING_PREVIEW, isLoadingPreview)
provide(IS_RESIZED, isResized)
provide(ES_MODULES, esModules)
const isFullpage = inject(IS_FULLPAGE) as Ref<boolean>

watch(
  isLoadingPreview,
  (newVal, oldVal) => {
    if (oldVal) {
      const styles = [
        'color: white',
        'background: #42b983',
        'margin-left: 4px',
        'padding: 2px 4px',
        'border-radius: 2px'
      ].join(';')
      console.log(
        `SFC File %c${props.sfcFilename}%c is Rendered`,
        styles,
        ''
      )
    }
  }
)

const sandboxStyles = computed(() => {
  return {
    height: `${props.height}px`
  }
})

const handleResize = (panes: PanesInfo) => {
  console.log(panes)
}
const handleResized = (panes: PanesInfo) => {
  isResized.value = true
  nextTick(() => (isResized.value = false))
}
</script>

<style lang="scss">
.sandbox {
  box-sizing: content-box;
  background-color: var(--sfc-sandbox-bg-color);
  border: 1px solid var(--sfc-sandbox-border-color);
  border-radius: 2px;
  font-size: 13px;
  &:hover {
    box-shadow: 0 0 10px 0 rgb(232 237 250 / 60%), 0 2px 4px 0 rgb(232 237 250 / 60%);
  }
  &.is-fullpage {
    position: fixed;
    height: 100% !important;
    width: 100% !important;
    top: 0;
    left: 0;
    z-index: 6666;
    border-radius: 0;
    border: none;
    animation: fullpage .3s ease-in;
  }
  &.not-fullpage {
    display: none;
  }
  animation: fade-in 1s ease-in;
}

@keyframes fullpage {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }
  80% {
    opacity: .66;
    transform: scale(1);
  }
  80%, 100% {
    opacity: 1;
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  50%, 100% {
    opacity: 1;
  }
}

.splitpanes.default-theme .splitpanes__pane {
  background-color: transparent;
}
.splitpanes.default-theme .splitpanes__splitter {
  background-color: var(--sfc-sandbox-header-bg-color);
  border-color: transparent;
  min-width: 1rem;
  min-height: 1rem;
}

.splitpanes.default-theme .splitpanes__splitter::before,
.splitpanes.default-theme .splitpanes__splitter::after {
  background-color: rgba(60, 60, 60, .5);
}

.splitpanes.default-theme .splitpanes__splitter:hover::before,
.splitpanes.default-theme .splitpanes__splitter:hover::after {
  background-color: rgba(60, 60, 60, .5);
}

.sfc-sandbox.dark .splitpanes.default-theme .splitpanes__splitter::before,
.sfc-sandbox.dark .splitpanes.default-theme .splitpanes__splitter::after {
  background-color: #444c56;
}

.sfc-sandbox.dark .splitpanes.default-theme .splitpanes__splitter:hover::before,
.sfc-sandbox.dark .splitpanes.default-theme .splitpanes__splitter:hover::after {
  background-color: #444c56;
}
</style>
