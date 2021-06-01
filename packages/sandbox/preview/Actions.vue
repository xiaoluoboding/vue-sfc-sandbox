<template>
  <!-- darkmode icon -->
  <div class="action" @click="toggleTheme">
    <template v-if="isDarkmode">
      <svg class="iconify iconify--bi" width="12px" height="12px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" style="transform: rotate(360deg);"><g fill="currentColor"><path d="M6 .278a.768.768 0 0 1 .08.858a7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277c.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316a.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71C0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29c0-1.167.242-2.278.681-3.286z"></path></g></svg>
    </template>
    <template v-else>
      <svg class="iconify iconify--bi" width="12px" height="12px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" style="transform: rotate(360deg);"><g fill="currentColor"><path d="M8 11a3 3 0 1 1 0-6a3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path></g></svg>
    </template>
  </div>
  <!-- fullpage icon -->
  <div class="action" @click="toggleFullpage">
    <template v-if="isFullpage">
      <svg class="iconify iconify--bi" width="12px" height="12px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" style="transform: rotate(360deg);"><g fill="currentColor"><path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"></path></g></svg>
    </template>
    <template v-else>
      <svg class="iconify iconify--bi" width="12px" height="12px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" style="transform: rotate(360deg);"><g fill="currentColor"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"></path></g></svg>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'
import { IS_DARKMODE, IS_FULLPAGE } from '../types'

export default defineComponent({
  setup () {
    const isFullpage = inject(IS_FULLPAGE) as Ref<boolean>
    const isDarkmode = inject(IS_DARKMODE) as Ref<boolean>

    const toggleFullpage = () => {
      isFullpage.value = !isFullpage.value
      if (isFullpage.value) {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
    }

    const toggleTheme = () => {
      isDarkmode.value = !isDarkmode.value
    }

    return {
      isFullpage,
      isDarkmode,
      toggleFullpage,
      toggleTheme
    }
  }
})
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px;
  background-color: var(--sfc-sandbox-button-bg-color);
  border-radius: .25rem;
  margin-right: 8px;
  &:hover {
    background-color: var(--sfc-sandbox-button-bg-color-hover);
  }
}
</style>
