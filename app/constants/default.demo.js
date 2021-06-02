export const SFC_CODE_ESM = `<template>
<div class="w-full h-full flex justify-center items-center">
  <h1 text="5xl green-500">{{ msg }}</h1>
</div>
</template>

<script>
export default {
  setup () {
    const msg = 'Hello World!'

    return {
      msg
    }
  }
}
</script>
`

export const SFC_CODE_ESM_SETUP = `<template>
<div class="w-full h-full flex justify-center items-center">
  <h1 text="5xl cyan-500">{{ msg }}</h1>
</div>
</template>

<script setup>
const msg = 'Hello World!'
</script>
`
