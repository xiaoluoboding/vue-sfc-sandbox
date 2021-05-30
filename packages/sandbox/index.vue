<template>
  <div class="sfc-sandbox" :class="{ dark: isDarkmode }">
    <Sandbox
      v-if="!isFullpage"
      :height="height"
      :importMaps="importMaps"
      :externals="externals"
      :sfcFilename="sfcFilename"
      :sfcCode="sharedCode"
    />
    <teleport to="body">
      <Sandbox
        is-teleport
        v-if="isFullpage"
        :height="height"
        :importMaps="importMaps"
        :externals="externals"
        :sfcFilename="sfcFilename"
        :sfcCode="sharedCode"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import Sandbox from './Repl.vue'
import { useDark } from '../components/use/useDark'

import { IS_FULLPAGE, SHARED_CODE, IS_DARKMODE } from './types'

export default defineComponent({
  name: 'SfcSandbox',

  components: { Sandbox },

  props: {
    // sandbox height unit (px)
    height: { type: Number, default: 400 },
    // specify a import maps in the <script> element include `type="importmap"`
    importMaps: { type: Object, default: () => ({}) },
    // specify some cdn like jsdelivr、unpkg
    externals: { type: Array, default: () => ([]) },
    // virtual sfc filename like `HelloWorld.vue`
    sfcFilename: { type: String, default: '', required: true },
    // transpile sfc code to es modules by `vue-sfc2esm`
    sfcCode: { type: String, default: '', required: true }
  },

  setup (props) {
    const isFullpage = ref(false)
    const sharedCode = ref(props.sfcCode)
    const isDarkmode = useDark()

    provide(IS_FULLPAGE, isFullpage)
    provide(SHARED_CODE, sharedCode)
    provide(IS_DARKMODE, isDarkmode)

    return {
      isFullpage,
      sharedCode,
      isDarkmode
    }
  }
})
</script>

<style>
body.overflow-hidden {
  overflow: hidden;
}

.sfc-sandbox {
  --sfc-sandbox-bg-color: #fff;
  --sfc-sandbox-header-bg-color: #f4f8fe;
  --sfc-sandbox-header-text-color: currentColor;
  --sfc-sandbox-bg-color-66: rgba(200, 207, 216, 0.66);
  --sfc-sandbox-border-color: rgb(232 237 250 / 100%);
  --sfc-sandbox-border-color-60: rgb(232 237 250 / 60%);
  --sfc-sandbox-loading-bg-color: rgba(255, 255, 255, .9);
}

.sfc-sandbox.dark {
  --sfc-sandbox-bg-color: #22272e;
  --sfc-sandbox-header-bg-color: #2d333b;
  --sfc-sandbox-header-text-color: #cdd9e5;
  --sfc-sandbox-bg-color-66: rgba(200, 207, 216, 0.66);
  --sfc-sandbox-border-color: #444c56;
  --sfc-sandbox-border-color-60: rgb(232 237 250 / 60%);
  --sfc-sandbox-loading-bg-color: rgba(0, 0, 0, .9);
}
</style>
