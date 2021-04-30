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
import { defineComponent, provide, reactive, ref, toRefs } from 'vue'
import Sandbox from './Sandbox.vue'

import { IS_FULLPAGE, SHARED_CODE, IS_DARKMODE } from './types'

export default defineComponent({
  name: 'SfcSandbox',

  components: { Sandbox },

  props: {
    // sandbox height unit (px)
    height: { type: Number, default: 400 },
    importMaps: { type: Object, default: () => ({}) },
    externals: { type: Array, default: () => ([]) },
    sfcFilename: { type: String, default: '' },
    sfcCode: { type: String, default: '' }
  },

  setup (props, { emit }) {
    const isFullpage = ref(false)
    const localProps = reactive(toRefs(props))
    const sharedCode = ref(props.sfcCode)
    const isDarkmode = ref(false)

    provide(IS_FULLPAGE, isFullpage)
    provide(SHARED_CODE, sharedCode)
    provide(IS_DARKMODE, isDarkmode)

    return {
      isFullpage,
      sharedCode,
      ...toRefs(localProps)
    }
  }
})
</script>
