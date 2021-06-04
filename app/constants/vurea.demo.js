export const SFC_CODE_ESM = `<template>
  <HexColorPicker :passedProps="attrs" />
</template>

<script>
import { ref } from 'vue'
import { useReactComponent } from 'vurea'

import { HexColorPicker } from 'react-colorful'

export default {
  name: 'HelloReact',
  components: {
    HexColorPicker: useReactComponent(HexColorPicker),
  },
  setup () {
    const color = ref('#4af')

    return {
      attrs: {
        color,
        onChange: (data, dataString) => {
          console.log(dataString)
        }
      }
    }
  }
}
</script>
`
