<template>
  <div class="wrapper">
    <h1>Hello Vue SFC Sandbox</h1>

    <!-- [ESM] default case -->
    <sfc-sandbox v-bind="defaultAttrs" />

    <sfc-sandbox v-bind="defaultSetupAttrs" />

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
import SfcSandbox from '../../packages/sandbox/index.vue'
import { SFC_CODE_ESM as defaultCode, SFC_CODE_ESM_SETUP as defaultSetupCode } from '../constants/default.demo.js'
import { SFC_CODE_CDN as echartsCode } from '../constants/echarts.demo.js'
import { SFC_CODE_ESM as veChartsCode } from '../constants/ve-charts.demo.js'
import { SFC_CODE_ESM as digitAnimationCode } from '../constants/digit-animation.demo.js'
import { SFC_CODE_ESM as vureaCode } from '../constants/vurea.demo.js'

const defaultAttrs = {
  height: 400,
  sfcFilename: 'DefaultDemo.vue',
  sfcCode: defaultCode
}

const defaultSetupAttrs = {
  height: 400,
  sfcFilename: 'DefaultDemo.vue',
  sfcCode: defaultSetupCode,
  scriptSetup: true,
  darkmode: true
}

const echartsAttrs = {
  height: 432,
  externals: [
    'https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js'
  ],
  sfcFilename: 'EchartsDemo.vue',
  sfcCode: echartsCode
}

const digitAnimationAttrs = {
  height: 400,
  importMaps: {
    'vue-digit-animation': 'https://cdn.jsdelivr.net/npm/vue-digit-animation@0.3.1/lib/vue-digit-animation.esm-browser.js',
    numeral: 'https://cdn.skypack.dev/numeral'
  },
  sfcFilename: 'DigitAnimationDemo.vue',
  sfcCode: digitAnimationCode
}

const veChartsAttrs = {
  height: 400,
  importMaps: {
    echarts: 'https://cdn.skypack.dev/echarts',
    'echarts/': 'https://cdn.skypack.dev/echarts',
    've-charts': 'https://cdn.skypack.dev/ve-charts@v1.0.0-alpha.6'
  },
  sfcFilename: 'VeChartsDemo.vue',
  sfcCode: veChartsCode
}

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
.wrapper {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  margin: 64px;
  gap: 32px;
}
</style>
