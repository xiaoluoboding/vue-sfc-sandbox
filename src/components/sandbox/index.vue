<template>
  <SplitPane class="sfc-sandbox" :style="sandboxStyles">
    <template #left>
      <sandbox-editor :sfc-filename="sfcFilename" :sfc-code="sfcCode" />
    </template>
    <template #right>
      <Suspense>
        <template #default v-if="esModules">
          <sandbox-preview />
        </template>
        <template #fallback>
          <loading-mask v-if="isLoadingPreview" />
        </template>
      </Suspense>
    </template>
  </SplitPane>
</template>

<script setup lang="ts" name="SfcSandbox">
import { computed, defineProps, provide, ref, watch } from 'vue'
import SplitPane from '../splte-pane/index.vue'
import SandboxEditor from './SandboxEditor.vue'
import SandboxPreview from './SandboxPreview.vue'
import LoadingMask from './LoadingMask.vue'

import { IMPORTS_MAP_KEY, CDN_LIST_KEY, IS_LOADING_PREVIEW, ES_MODULES } from './types'

const props = defineProps({
  // sandbox height unit (px)
  height: { type: Number, default: 400 },
  importsMap: { type: Object, default: () => ({}) },
  cdnList: { type: Array, default: () => ([]) },
  sfcFilename: { type: String, default: '' },
  sfcCode: { type: String, default: '' }
})

const isLoadingPreview = ref(true)
const esModules = ref([])

provide(IMPORTS_MAP_KEY, props.importsMap)
provide(CDN_LIST_KEY, props.cdnList)
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
