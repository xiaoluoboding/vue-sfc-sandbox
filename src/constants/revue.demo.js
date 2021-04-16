export const SFC_CODE_ESM = `<template>
  <div>
    <VSelect :options="options" @onChange="onChange" />
  </div>
</template>

<script>
import Select from 'react-select'
import { ReactInVue } from 'vuera'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]

const VSelect = ReactInVue(Select)

export default {
  name: 'HelloReact',
  components: {
    VSelect
  },
  setup () {
    return {
      options
    }
  },
  methods: {
    onChange (data, dataString) {
      console.log(dataString)
    }
  }
}
</script>
`
