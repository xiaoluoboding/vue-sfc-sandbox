<template>
  <SplitPane
    class="sfc-sandbox"
    :class="{ 'is-fullpage': isFullpage }"
    :style="sandboxStyles"
    @resized="handleResized"
  >
    <template #left>
      <SandboxEditor :sfc-filename="sfcFilename" :sfc-code="sfcCode" />
    </template>
    <template #right>
      <!-- <Suspense>
        <template #default v-if="esModules">
          <sandbox-preview />
        </template>
        <template #fallback>
          <loading-mask v-if="isLoadingPreview" />
        </template>
      </Suspense> -->
      <SandboxPreview :sfc-filename="sfcFilename" v-show="esModules" />
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { computed, defineProps, nextTick, provide, ref, watch } from 'vue'
import SplitPane from '../components/SplitPane.vue'
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
  sfcCode: { type: String, default: '' }
})

const isLoadingPreview = ref(false)
const isResized = ref(false)
const isFullpage = ref(false)
const esModules = ref([])

provide(IMPORT_MAPS_KEY, props.importMaps)
provide(EXTERNALS_KEY, props.externals)
provide(IS_LOADING_PREVIEW, isLoadingPreview)
provide(IS_RESIZED, isResized)
provide(IS_FULLPAGE, isFullpage)
provide(ES_MODULES, esModules)

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
.sfc-sandbox {
  --sfc-sandbox-bg-color: #f4f8fe;
  --sfc-sandbox-border-color: rgb(232 237 250 / 100%);
  --sfc-sandbox-border-color-60: rgb(232 237 250 / 60%);
  box-sizing: content-box;
  background-color: #fff;
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
  }
}
</style>
