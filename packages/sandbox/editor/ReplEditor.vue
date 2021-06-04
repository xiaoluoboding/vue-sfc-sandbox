<template>
  <div class="sfc-sandbox__editor">
    <header class="editor-header">
      <div class="editor-header__left">
        <template v-if="activeMode === 'Template'">
          {{ activeMode }}
        </template>
        <template v-else>
          <template v-if="isScriptSetup">
            <span title="<script setup> is still an experimental proposal.">Script Setup</span>
          </template>
          <template v-else>
            <span>Script</span>
          </template>
          <!-- <div class="btn-group">
            <div
              class="btn btn-xs"
              :class="{ 'btn-active': !isScriptSetup }"
              @click="handleSetSetup(false)"
            >
              Script
            </div>
            <div
              class="btn btn-xs"
              :class="{ 'btn-active': isScriptSetup }"
              @click="handleSetSetup(true)"
              title="<script setup> is still an experimental proposal."
            >
              Script Setup
            </div>
          </div> -->
        </template>
      </div>
      <div class="editor-header__right"></div>
    </header>
    <main class="editor-container">
      <MonacoEditor v-model="activeCode" :language="language" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, inject, Ref } from 'vue'

import MonacoEditor from '../../components/monaco/index.vue'
import { IS_SCRIPT_SETUP } from '../types'

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
    const isScriptSetup = inject(IS_SCRIPT_SETUP) as Ref<boolean>

    const activeMode = computed(() => {
      return props.mode === 'template' ? 'Template' : 'Script'
    })

    const handleSetSetup = (isSetup: boolean) => {
      isScriptSetup.value = isSetup
    }

    watch(
      () => activeCode.value,
      (newVal) => {
        emit('update:code', newVal)
      },
      { immediate: true }
    )

    return {
      activeCode,
      activeMode,
      isScriptSetup,
      handleSetSetup
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
      padding: 0 8px;
      font-weight: 500;
      .btn-group {
        display: flex;
        flex-wrap: wrap;
      }
      .btn-group>.btn-active {
        background-color: var(--sfc-sandbox-button-bg-color);
        border-color: var(--sfc-sandbox-button-bg-color);
      }
      .btn {
        cursor: pointer;
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        text-align: center;
        user-select: none;
      }
      .btn-xs {
        height: 1.5rem;
        font-size: .75rem;
        line-height: 1rem;
        line-height: 1.625;
        padding-left: .5rem;
        padding-right: .5rem;
        min-height: 1.5rem;
        border-radius: 4px;
        margin-right: 8px;
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
