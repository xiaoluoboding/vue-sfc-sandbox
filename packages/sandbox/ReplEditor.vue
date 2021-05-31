<template>
  <div class="sfc-sandbox__editor">
    <header class="editor-header">
      <div class="editor-header__left">{{ activeMode }}</div>
      <div class="editor-header__right"></div>
    </header>
    <main class="editor-container">
      <MonacoEditor v-model="activeCode" :language="language" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'

import MonacoEditor from '../components/monaco/index.vue'

export default defineComponent({
  name: 'RelpEditor',

  components: { MonacoEditor },

  props: {
    code: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    mode: { type: String, default: 'Javascript' }
  },

  setup (props, { emit }) {
    const activeCode = ref(props.code)

    const activeMode = computed(() => {
      return props.mode === 'template' ? 'Template' : 'Script'
    })

    watch(
      () => activeCode.value,
      (newVal) => {
        emit('update:code', newVal)
      },
      { immediate: true }
    )

    return {
      activeCode,
      activeMode
    }
  }
})
</script>

<style lang="scss" scoped>
.sfc-sandbox__editor {
  height: 100%;
  .editor-header {
    box-sizing: border-box;
    display: flex;
    height: 32px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--sfc-sandbox-header-bg-color);
    border-bottom: 1px solid var(--sfc-sandbox-border-color);
    .editor-header__left {
      padding: 10px 12px;
      font-weight: 500;
    }
    .editor-header__right {
      .actions {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        &:hover {
          background-color: var(--sfc-sandbox-bg-color-66);
        }
        .darkmode {
          transition: all 0.3s ease-in;
        }
        .darkmode.light {
          transform: rotate(540deg);
        }
      }
    }
  }
  .editor-container {
    height: calc(100% - 32px);
    overflow: hidden;
    position: relative;
  }
}
</style>
