<template>
  <div class="wrapper">
    <sandbox />
  </div>
</template>

<script setup lang="ts">
import Sandbox from './components/sandbox/index.vue'
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
