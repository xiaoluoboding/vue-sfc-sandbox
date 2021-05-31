export const SFC_CODE_ESM = `<template>
  <h1 class="text-5xl text-green-500">{{ msg }}</h1>
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
