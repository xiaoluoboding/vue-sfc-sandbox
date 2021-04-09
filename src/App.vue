<template>
  <!-- old version -->
  <!-- <script src="//unpkg.com/echarts@4.9.0/dist/echarts.min.js"></script> -->
  <!-- <script src="//unpkg.com/ve-charts@latest/lib/ve-charts.umd.min.js"></script> -->

  <!-- new version -->
  <!-- <script src="//cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js"></script> -->
  <!-- <script src="//unpkg.com/ve-charts@1.0.0-alpha.2/packages/lib/index.umd.js"></script> -->

  <!-- esm version -->
  <!-- <script type="module" src="https://cdn.jsdelivr.net/npm/echarts/+esm"></script> -->
  <!-- <script async src="//unpkg.com/browse/ve-charts@1.0.0-alpha.2/packages/lib/index.umd.js"></script> -->
  <div class="wrapper">
    <!-- <sandbox :height="400" :key="Math.random * 100" /> -->
    <sandbox
      :height="400"
      :imports-map="importsMap"
      :cdn-list="cdnList"
      :sfc-code="echartsCode"
    />
  </div>
</template>

<script setup lang="ts">
import Sandbox from './components/sandbox/index.vue'
import { SFC_CODE as echartsCode } from './constants/echarts-demo.js'

const importsMap = {
  // 've-charts': 'https://unpkg.com/browse/ve-charts@1.0.0-alpha.2/packages/lib/index.umd.js'
  echarts: 'https://cdn.jsdelivr.net/npm/echarts/+esm'
}

const cdnList = [
  'https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js'
]
</script>

<style scoped>
body {
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--base);
  margin: 0;
  background-color: #f8f8f8;
  --base: #444;
  --nav-height: 50px;
  --font-code: 'Source Code Pro', monospace;
  --color-branding: #3ca877;
  --color-branding-dark: #416f9c;
}

.wrapper {
  height: calc(100vh - var(--nav-height));
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
