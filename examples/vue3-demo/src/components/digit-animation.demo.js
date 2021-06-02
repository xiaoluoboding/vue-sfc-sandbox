export const SFC_CODE_ESM = `<template>
<div class="flex justify-center items-center w-full h-full text-green-300">
  <digit-animation-group
    size="6xl"
    use-ease="Quit.easeInOut"
    :digits="digits"
    :duration="1000"
  />
</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { DigitAnimationGroup } from 'vue-digit-animation'

export default {
  components: {
    DigitAnimationGroup
  },
  setup () {
    const digits = ref(9527)

    const randomDigit = () => {
      digits.value = Math.floor(Math.random() * Math.floor(100000))
    }

    onMounted(() => {
      setInterval(() => {
        randomDigit()
      }, 3333)
    })

    return {
      digits
    }
  }
}
</script>
`
