<template>
  <teleport to="body" v-if="isFullpage">
    <div class="sfc-sandbox is-fullpage" :class="{ dark: isDarkmode }">
      <Sandbox
        :height="height"
        :import-maps="importMaps"
        :externals="externals"
        :sfc-filename="sfcFilename"
        :sfc-code="sharedCode"
        :editor-options="editorOptions"
      />
    </div>
  </teleport>
  <div class="sfc-sandbox" :class="{ dark: isDarkmode }" v-else>
    <Sandbox
      :height="height"
      :import-maps="importMaps"
      :externals="externals"
      :sfc-filename="sfcFilename"
      :sfc-code="sharedCode"
      :editor-options="editorOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, toRefs } from 'vue'
import Sandbox from './Sandbox.vue'
import { useDark } from '../composable/useDark'

import { SHARED_CODE, IS_DARKMODE, WINDI_CSS, IS_SCRIPT_SETUP, IS_FULLPAGE } from './types'

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
    sfcCode: { type: String, default: '', required: true },
    // define editor options
    editorOptions: { type: Object, default: () => ({}) }
  },

  setup (props) {
    const isScriptSetup = ref(props.editorOptions.isScriptSetup)
    const sharedCode = ref(props.sfcCode)
    const windicss = ref('')
    const isFullpage = ref(false)
    const isDarkmode = useDark()

    provide(IS_SCRIPT_SETUP, isScriptSetup)
    provide(SHARED_CODE, sharedCode)
    provide(IS_FULLPAGE, isFullpage)
    provide(IS_DARKMODE, isDarkmode)
    provide(WINDI_CSS, windicss)

    return {
      sharedCode,
      isFullpage,
      isDarkmode,
      isScriptSetup,
      windicss
    }
  }
})
</script>

<style lang="scss">
body.overflow-hidden {
  overflow: hidden;
}

.sfc-sandbox {
  --sfc-sandbox-bg-color: #fff;
  --sfc-sandbox-header-bg-color: #f4f8fe;
  --sfc-sandbox-header-text-color: #24292e;
  --sfc-sandbox-bg-color-66: rgba(200, 207, 216, 0.66);
  --sfc-sandbox-border-color: rgb(232 237 250 / 100%);
  --sfc-sandbox-border-color-splitter: rgba(60, 60, 60, .5);
  --sfc-sandbox-loading-bg-color: rgba(255, 255, 255, .9);
  --sfc-sandbox-button-bg-color: #e1ebf5;
  --sfc-sandbox-button-bg-color-hover: #dfefff;
}

.sfc-sandbox.dark {
  --sfc-sandbox-bg-color: #22272e;
  --sfc-sandbox-header-bg-color: #2d333b;
  --sfc-sandbox-header-text-color: #cdd9e5;
  --sfc-sandbox-bg-color-66: rgba(200, 207, 216, 0.66);
  --sfc-sandbox-border-color: #444c56;
  --sfc-sandbox-border-color-splitter: #444c56;
  --sfc-sandbox-loading-bg-color: rgba(0, 0, 0, .9);
  --sfc-sandbox-button-bg-color: #373e47;
  --sfc-sandbox-button-bg-color-hover: #768390;
}

.sfc-sandbox {
  box-sizing: content-box;
  color: var(--sfc-sandbox-header-text-color);
  background-color: var(--sfc-sandbox-bg-color);
  box-shadow: 0 0 0 1px rgb(232 237 250 / 60%), 0 2px 4px 0 rgb(232 237 250 / 60%);
  border-radius: 2px;
  font-size: 12px;
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
    .splitpanes {
      height: inherit !important;
    }
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
</style>
