import { ref, onMounted, onUnmounted } from 'vue'

export function useDark () {
  let mediaQuery = null

  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  }

  const matches = ref(mediaQuery ? mediaQuery.matches : false)

  function handler (event) {
    matches.value = event.matches
  }

  onMounted(() => {
    if (!mediaQuery) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    }

    handler(mediaQuery)
    mediaQuery.addListener(handler)
  })

  onUnmounted(() => {
    mediaQuery.removeListener(handler)
  })

  return matches
}
