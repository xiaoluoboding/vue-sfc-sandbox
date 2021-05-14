<template>
  <div class="hello">
    <div>
      <h1>{{ msg }}</h1>
    </div>
    <!-- [ESM] default case -->
    <sfc-sandbox v-bind="defaultAttrs" />

    <!-- [CDN] echarts case -->
    <sfc-sandbox v-bind="echartsAttrs" />

    <!-- [ESM] Vue3 component case -->
    <sfc-sandbox v-bind="digitAnimationAttrs" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SFC_CODE_ESM as defaultCode } from './default.demo.js'
import { SFC_CODE_CDN as echartsCode } from './echarts.demo.js'
import { SFC_CODE_ESM as digitAnimationCode } from './digit-animation.demo.js'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup () {
    const defaultAttrs = {
      height: 200,
      sfcFilename: 'DefaultDemo.vue',
      sfcCode: defaultCode
    }

    const echartsAttrs = {
      height: 400,
      externals: [
        'https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js'
      ],
      sfcFilename: 'EchartsDemo.vue',
      sfcCode: echartsCode
    }

    const digitAnimationAttrs = {
      height: 400,
      importMaps: {
        'vue-digit-animation': 'https://cdn.jsdelivr.net/npm/vue-digit-animation@0.2.1/lib/vue-digit-animation.esm-browser.js'
      },
      sfcFilename: 'DigitAnimationDemo.vue',
      sfcCode: digitAnimationCode
    }

    return {
      defaultAttrs,
      echartsAttrs,
      digitAnimationAttrs
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  margin: 60px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}
h1 {
  width: 100%;
  text-align: center;
}
</style>
