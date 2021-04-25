<template>
  <SplitPane
    class="sfc-sandbox"
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
      <SandboxPreview v-show="esModules" />
      <LoadingMask v-if="isLoadingPreview" />
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { computed, defineProps, provide, ref, watch } from 'vue'
import SplitPane from '../components/SplitPane.vue'
import SandboxEditor from './SandboxEditor.vue'
import SandboxPreview from './SandboxPreview.vue'
import LoadingMask from '../components/LoadingMask.vue'

import {
  IMPORT_MAPS_KEY,
  EXTERNALS_KEY,
  IS_LOADING_PREVIEW,
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
const esModules = ref([])

provide(IMPORT_MAPS_KEY, props.importMaps)
provide(EXTERNALS_KEY, props.externals)
provide(IS_LOADING_PREVIEW, isLoadingPreview)
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
  console.log(panes)
}
</script>

<style lang="scss">
.sfc-sandbox {
  box-sizing: content-box;
  border: 1px solid #ebebeb;
  border-radius: 2px;
  margin: 20px;
  font-size: 13px;
  &--editor,
  &--preview {
    width: 50%;
  }
  &--editor {
    border-right: 1px dashed #ebebeb;
  }
  &:hover {
    box-shadow: 0 0 10px 0 rgb(232 237 250 / 60%), 0 2px 4px 0 rgb(232 237 250 / 60%);
  }
}
</style>
