<template>
  <div class="wrapper">
    <sandbox :height="600" :imports-map="importsMap" />
  </div>
</template>

<script setup lang="ts">
import Sandbox from './components/sandbox/index.vue'

const importsMap = {
  // 've-charts': 'https://unpkg.com/browse/ve-charts@1.0.0-alpha.2/packages/lib/index.umd.js'
  echarts: 'https://cdn.jsdelivr.net/npm/echarts/+esm'
}
</script>

<style>
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
