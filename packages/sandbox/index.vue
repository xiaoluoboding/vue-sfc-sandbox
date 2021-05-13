<template>
  <div class="sfc-sandbox">
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
import Sandbox from './Sandbox.vue'

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
    const isDarkmode = ref(false)

    provide(IS_FULLPAGE, isFullpage)
    provide(SHARED_CODE, sharedCode)
    provide(IS_DARKMODE, isDarkmode)

    return {
      isFullpage,
      sharedCode
    }
  }
})
</script>

<style>
body.overflow-hidden {
  overflow: hidden;
}
</style>
