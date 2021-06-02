<template>
  <splitpanes horizontal>
    <pane>
      <ReplEditor v-model:code="templateCode" mode="template" language="html" />
    </pane>
    <pane>
      <ReplEditor v-model:code="scriptCode" mode="script" language="javascript" />
    </pane>
  </splitpanes>
</template>

<script lang="ts">
/* eslint-disable no-useless-escape */
import { ref, onMounted, inject, Ref, watch, defineComponent } from 'vue'
import * as defaultCompiler from '@vue/compiler-sfc'
import { compileModules, addFile, changeFile } from 'vue-sfc2esm'
import { Splitpanes, Pane } from 'splitpanes'

import ReplEditor from './ReplEditor.vue'
// import Message from './Message.vue'
// import { compileModules, addFile, changeFile } from '../plugins/vue-sfc2esm.esm' // for local test
import { debounce } from '../utils'
import { generateStyles } from '../repl/windiCompiler'
import { ES_MODULES, IS_LOADING_PREVIEW, SHARED_CODE, WINDI_CSS, IS_SCRIPT_SETUP } from '../types'

export default defineComponent({
  name: 'SandboxEditor',

  components: {
    Splitpanes,
    Pane,
    ReplEditor
  },

  props: {
    sfcFilename: { type: String, default: 'App.vue' },
    sfcCode: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    mode: { type: String, default: 'script' }
  },

  setup (props) {
    const isLoading = inject(IS_LOADING_PREVIEW) as Ref<boolean>
    const esModules = inject(ES_MODULES) as Ref<Array<string>>
    const sharedCode = inject(SHARED_CODE) as Ref<string>
    const windicss = inject(WINDI_CSS) as Ref<string>
    const isScriptSetup = inject(IS_SCRIPT_SETUP) as Ref<boolean>

    const { descriptor } = defaultCompiler.parse(props.sfcCode, { filename: props.sfcFilename })

    const activeCode = ref(props.sfcCode)

    const templateContent = ((descriptor.template && descriptor.template.content) as string).trim()
    const scriptContent = isScriptSetup.value
      ? ((descriptor.scriptSetup && descriptor.scriptSetup.content) as string).trim()
      : ((descriptor.script && descriptor.script.content) as string).trim()

    const templateCode = ref(templateContent)
    const scriptCode = ref(scriptContent)

    const onChange = debounce(async (code: string) => {
      sharedCode.value = code
      isLoading.value = true
      windicss.value = ''
      esModules.value = []

      // change the sfc code
      changeFile(props.sfcFilename, code)

      // compile windcss
      windicss.value = generateStyles(templateCode.value)

      // compile esm
      esModules.value = await compileModules(props.sfcFilename)
      isLoading.value = false
    }, 250)

    watch(
      () => [templateCode, scriptCode],
      () => {
        const sfcCode = `
          <template>
            ${templateCode.value}
          </template>

          ${isScriptSetup.value ? '<script setup>' : '<script>'}
            ${scriptCode.value}
          <\/script>
        `
        onChange(sfcCode)
      },
      {
        deep: true,
        immediate: true
      }
    )

    onMounted(() => {
      if (props.sfcCode !== '') {
        addFile(props.sfcFilename, props.sfcCode)
        activeCode.value = props.sfcCode
      }
    })

    return {
      activeCode,
      templateCode,
      scriptCode
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
