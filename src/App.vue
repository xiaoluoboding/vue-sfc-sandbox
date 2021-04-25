<template>
  <div class="wrapper">
    <!-- [ESM] default case -->
    <sfc-sandbox v-bind="defaultAttrs" />

    <!-- [CDN] echarts case -->
    <sfc-sandbox v-bind="echartsAttrs" />

    <!-- [ESM] ve-charts case -->
    <!-- <sfc-sandbox v-bind="veChartsAttrs" /> -->

    <!-- [ESM] Vue3 component case -->
    <!-- <sfc-sandbox v-bind="digitAnimationAttrs" /> -->

    <!-- [ESM] React component case -->
    <!-- <sfc-sandbox v-bind="revueAttrs" /> -->
  </div>
</template>

<script setup lang="ts">
import SfcSandbox from '../packages/sandbox/index.vue'
import { SFC_CODE_ESM as defaultCode } from './constants/default.demo.js'
import { SFC_CODE_CDN as echartsCode } from './constants/echarts.demo.js'
import { SFC_CODE_ESM as veChartsCode } from './constants/ve-charts.demo.js'
import { SFC_CODE_ESM as digitAnimationCode } from './constants/digit-animation.demo.js'
import { SFC_CODE_ESM as revueCode } from './constants/revue.demo.js'

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

const veChartsAttrs = {
  height: 400,
  importMaps: {
    echarts: 'https://cdn.skypack.dev/echarts',
    'echarts/': 'https://cdn.skypack.dev/echarts',
    've-charts': 'https://cdn.skypack.dev/ve-charts@v1.0.0-alpha.4'
  },
  sfcFilename: 'VeChartsDemo.vue',
  sfcCode: veChartsCode
}

const digitAnimationAttrs = {
  height: 400,
  importMaps: {
    'vue-digit-animation': 'https://cdn.jsdelivr.net/npm/vue-digit-animation@0.2.1/lib/vue-digit-animation.esm-browser.js'
  },
  sfcFilename: 'DigitAnimationDemo.vue',
  sfcCode: digitAnimationCode
}

// const revueAttrs = {
//   height: 400,
//   importMaps: {
//     // antd: 'https://unpkg.com/antd@4.15.1/es/index.js',
//     vuera: 'https://cdn.skypack.dev/vuera',
//     'react-select': 'https://cdn.skypack.dev/react-select'
//   },
//   sfcCode: revueCode
// }
</script>

<style scoped>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--base);
  margin: 0;
  background-color: #f8f8f8;
  --base: #444;
  --font-code: 'Source Code Pro', monospace;
  --color-branding: #3ca877;
  --color-branding-dark: #416f9c;
}

.wrapper {
  height: 100vh;
}
</style>
