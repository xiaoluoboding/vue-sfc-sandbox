<template>
  <div class="wrapper">
    <!-- <sandbox :height="400" :key="Math.random * 100" /> -->
    <!-- <sandbox v-bind="veChartsAttrs" /> -->
    <sandbox v-bind="digitAnimationAttrs" />
  </div>
</template>

<script setup lang="ts">
import Sandbox from './components/sandbox/index.vue'
import { SFC_CODE_ESM as echartsCode } from './constants/echarts-demo.js'
import { SFC_CODE_ESM as digitAnimationCode } from './constants/digit-animation-demo.js'

const veChartsAttrs = {
  importsMap: {
    echarts: 'https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.esm.js',
    'echarts/': 'https://cdn.jsdelivr.net/npm/echarts@5.0.2/lib/export/'
  },
  cdnList: [
    'https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js'
  ],
  sfcCode: echartsCode
}

const digitAnimationAttrs = {
  height: 400,
  importsMap: {
    'vue-digit-animation': 'https://cdn.jsdelivr.net/npm/vue-digit-animation@0.2.1/lib/vue-digit-animation.esm-browser.js'
  },
  sfcCode: digitAnimationCode
}
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

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
