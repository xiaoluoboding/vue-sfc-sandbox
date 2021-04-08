<template>
  <SplitPane class="sandbox" :style="sandboxStyles">
    <template #left>
      <sandbox-editor />
    </template>
    <template #right>
      <sandbox-preview />
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { computed, defineProps, provide, InjectionKey } from 'vue'
import SplitPane from '../splte-pane/index.vue'
import SandboxEditor from './SandboxEditor.vue'
import SandboxPreview from './SandboxPreview.vue'

import { IMPORTS_MAP_KEY } from './types'
import { DEMO_1, OPTIONS_1 } from './examples'

const props = defineProps({
  // sandbox height unit (px)
  height: { type: Number, default: 400 },
  importsMap: { type: Object, default: () => ({}) }
})

provide(IMPORTS_MAP_KEY, props.importsMap)

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
  font-size: 14px;
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
