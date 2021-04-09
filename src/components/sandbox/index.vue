<template>
  <SplitPane class="sandbox" :style="sandboxStyles">
    <template #left>
      <sandbox-editor :sfc-code="sfcCode" />
    </template>
    <template #right>
      <sandbox-preview />
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { computed, defineProps, provide } from 'vue'
import SplitPane from '../splte-pane/index.vue'
import SandboxEditor from './SandboxEditor.vue'
import SandboxPreview from './SandboxPreview.vue'

import { IMPORTS_MAP_KEY, CDN_LIST_KEY } from './types'

const props = defineProps({
  // sandbox height unit (px)
  height: { type: Number, default: 400 },
  importsMap: { type: Object, default: () => ({}) },
  cdnList: { type: Array, default: () => ([]) },
  sfcCode: { type: String, default: '' }
})

provide(IMPORTS_MAP_KEY, props.importsMap)
provide(CDN_LIST_KEY, props.cdnList)

const sandboxStyles = computed(() => {
  return {
    height: `${props.height}px`
  }
})
</script>

<style lang="scss">
.sandbox {
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
