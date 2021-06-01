<template>
  <splitpanes
    class="sandbox default-theme"
    :style="sandboxStyles"
    @resized="handleResized"
  >
    <pane min-size="20">
      <SandboxEditor :sfc-filename="sfcFilename" :sfc-code="sfcCode" />
    </pane>
    <pane max-size="80">
      <SandboxPreview :sfc-filename="sfcFilename" :sfc-code="sfcCode" v-show="esModules" />
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import { computed, nextTick, provide, ref, watch, defineComponent } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import SandboxEditor from './editor/index.vue'
import SandboxPreview from './preview/index.vue'

import {
  IMPORT_MAPS_KEY,
  EXTERNALS_KEY,
  IS_LOADING_PREVIEW,
  IS_RESIZED,
  ES_MODULES
} from './types'

import { logger } from './utils'

export default defineComponent({
  name: 'Sandbox',

  components: {
    Splitpanes,
    Pane,
    SandboxEditor,
    SandboxPreview
  },

  props: {
    // sandbox height unit (px)
    height: { type: Number, default: 400 },
    importMaps: { type: Object, default: () => ({}) },
    externals: { type: Array, default: () => ([]) },
    sfcFilename: { type: String, default: '' },
    sfcCode: { type: String, default: '' }
  },

  setup (props) {
    const isLoadingPreview = ref(false)
    const isResized = ref(false)
    const esModules = ref([])

    provide(IMPORT_MAPS_KEY, props.importMaps)
    provide(EXTERNALS_KEY, props.externals)
    provide(IS_LOADING_PREVIEW, isLoadingPreview)
    provide(IS_RESIZED, isResized)
    provide(ES_MODULES, esModules)

    const sandboxStyles = computed(() => {
      return {
        height: `${props.height}px`
      }
    })

    watch(
      isLoadingPreview,
      (newVal, oldVal) => {
        if (oldVal) {
          logger(`SFC File %c${props.sfcFilename}%c is Rendered`)
        }
      }
    )

    const handleResized = () => {
      isResized.value = true
      nextTick(() => (isResized.value = false))
    }

    return {
      sandboxStyles,
      esModules,
      handleResized
    }
  }
})
</script>

<style lang="scss">
.splitpanes.default-theme .splitpanes__pane {
  background-color: transparent;
}
.splitpanes.default-theme .splitpanes__splitter {
  background-color: var(--sfc-sandbox-header-bg-color);
  // border-color: transparent;
  min-width: 1rem;
  min-height: 1rem;
}

.splitpanes.default-theme .splitpanes__splitter::before,
.splitpanes.default-theme .splitpanes__splitter::after {
  background-color: var(--sfc-sandbox-border-color-splitter);
}

.splitpanes.default-theme .splitpanes__splitter:hover::before,
.splitpanes.default-theme .splitpanes__splitter:hover::after {
  background-color: transparent;
}

.default-theme.splitpanes--vertical>.splitpanes__splitter,
.default-theme .splitpanes--vertical>.splitpanes__splitter {
  border-left: 1px solid var(--sfc-sandbox-border-color);
  border-right: 1px solid var(--sfc-sandbox-border-color);
}

.default-theme.splitpanes--horizontal>.splitpanes__splitter,
.default-theme .splitpanes--horizontal>.splitpanes__splitter {
  border-top: 1px solid var(--sfc-sandbox-border-color);
  border-bottom: 1px solid var(--sfc-sandbox-border-color);
}
</style>
