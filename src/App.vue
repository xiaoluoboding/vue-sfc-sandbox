<template>
  <div class="wrapper">
    <!-- [ESM] default case -->
    <sfc-sandbox v-bind="defaultAttrs" />

    <!-- [CDN] echarts case -->
    <sfc-sandbox v-bind="echartsAttrs" />

    <!-- [ESM] Vue3 component case -->
    <sfc-sandbox v-bind="digitAnimationAttrs" />

    <!-- [ESM] ve-charts case -->
    <!-- <sfc-sandbox v-bind="veChartsAttrs" /> -->

    <!-- [ESM] React component case -->
    <!-- <sfc-sandbox v-bind="vureaAttrs" /> -->
  </div>
</template>

<script setup lang="ts">
import SfcSandbox from '../packages/sandbox/index.vue'
import { SFC_CODE_ESM as defaultCode } from './constants/default.demo.js'
import { SFC_CODE_CDN as echartsCode } from './constants/echarts.demo.js'
// import { SFC_CODE_ESM as veChartsCode } from './constants/ve-charts.demo.js'
import { SFC_CODE_ESM as digitAnimationCode } from './constants/digit-animation.demo.js'
import { SFC_CODE_ESM as vureaCode } from './constants/vurea.demo.js'

const defaultAttrs = {
  height: 200,
  sfcFilename: 'DefaultDemo.vue',
  sfcCode: defaultCode
}

const echartsAttrs = {
  height: 440,
  externals: [
    'https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js'
  ],
  sfcFilename: 'EchartsDemo.vue',
  sfcCode: echartsCode
}

const digitAnimationAttrs = {
  height: 400,
  importMaps: {
    'vue-digit-animation': 'https://cdn.jsdelivr.net/npm/vue-digit-animation@0.2.1/lib/vue-digit-animation.esm-browser.js'
  },
  sfcFilename: 'DigitAnimationDemo.vue',
  sfcCode: digitAnimationCode
}

// const veChartsAttrs = {
//   height: 400,
//   importMaps: {
//     echarts: 'https://cdn.skypack.dev/echarts',
//     'echarts/': 'https://cdn.skypack.dev/echarts',
//     've-charts': 'https://cdn.skypack.dev/ve-charts@v1.0.0-alpha.5'
//   },
//   sfcFilename: 'VeChartsDemo.vue',
//   sfcCode: veChartsCode
// }

const vureaAttrs = {
  height: 400,
  importMaps: {
    'react-colorful': 'https://cdn.skypack.dev/react-colorful',
    vurea: 'https://cdn.skypack.dev/vurea@v1.0.0-alpha.2'
  },
  sfcFilename: 'ReactInVue.vue',
  sfcCode: vureaCode
}
</script>

<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--base);
  margin: 0;
  background-color: #fff;
  --base: #444;
  --font-code: 'Source Code Pro', monospace;
  --color-branding: #3ca877;
  --color-branding-dark: #416f9c;
}

#app {
  height: 100%;
}

.wrapper {
  display: grid;
  margin: 64px;
  gap: 32px;
}
</style>
