<template>
  <div
    ref="container"
    class="split-pane"
    :class="{ dragging, 'is-vertical': !isHorizontal }"
    :style="splitPaneStyle"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragging = false"
  >
    <div class="split-pane__left" :style="leftStyle">
      <slot name="left" />
    </div>
    <div class="split-pane__dragger" :style="draggerStyle" @mousedown.prevent="dragStart" />
    <div class="split-pane__right" :style="rightStyle">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, toRefs, computed, onMounted, onUnmounted } from 'vue'
import { debounce } from '../sandbox/utils'
import { PanesInfo } from '../sandbox/types'

export default defineComponent({
  name: 'SplitPane',
  setup (props, { emit }) {
    const container = ref()

    const state = reactive({
      dragging: false,
      split: 50,
      isHorizontal: true
    })

    function boundSplit () {
      const { split } = state
      return split < 20
        ? 20
        : split > 80
          ? 80
          : split
    }

    let startPositionX = 0
    let startPositionY = 0
    let startSplit = 0

    function dragStart (e: MouseEvent) {
      state.dragging = true
      startPositionX = e.pageX
      startPositionY = e.pageY
      startSplit = boundSplit()
    }

    function dragMove (e: MouseEvent) {
      if (state.dragging) {
        const totalSize = container.value.offsetWidth
        const position = state.isHorizontal ? e.pageX : e.pageY
        const dp = position - (state.isHorizontal ? startPositionX : startPositionY)
        state.split = startSplit + ~~(dp / totalSize * 100)

        emit('resize', [
          { size: boundSplit() },
          { size: (100 - boundSplit()) }
        ] as PanesInfo)
      }
    }

    function dragEnd () {
      if (!state.dragging) return
      state.dragging = false

      emit('resized', [
        { size: boundSplit() },
        { size: (100 - boundSplit()) }
      ] as PanesInfo)
    }

    const onResize = () => {
      const containerSize = container.value.offsetWidth
      state.isHorizontal = containerSize > 720
    }

    const splitPaneStyle = computed(() => {
      return {
        'flex-direction': state.isHorizontal ? 'row' : 'column'
      }
    })

    const leftStyle = computed(() => {
      return state.isHorizontal
        ? { width: boundSplit() + '%' }
        : { height: boundSplit() + '%' }
    })

    const rightStyle = computed(() => {
      return state.isHorizontal
        ? { width: (100 - boundSplit()) + '%' }
        : { height: (100 - boundSplit()) + '%' }
    })

    const draggerStyle = computed(() => {
      return state.isHorizontal
        ? { top: 0, bottom: 0, right: 0, cursor: 'col-resize' }
        : { left: 0, right: 0, bottom: 0, cursor: 'row-resize' }
    })

    onMounted(() => {
      window.addEventListener('resize', onResize, false)
      onResize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onResize, false)
    })

    return {
      container,
      dragStart,
      dragMove,
      dragEnd,
      boundSplit,
      splitPaneStyle,
      leftStyle,
      rightStyle,
      draggerStyle,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.split-pane {
  display: flex;
  height: 100%;
}
.split-pane.dragging {
  cursor: col-resize;
}
.split-pane.dragging.is-vertical {
  cursor: row-resize;
}
.dragging .split-pane__left,
.dragging .split-pane__right {
  pointer-events: none;
}
.split-pane__left,
.split-pane__right {
  position: relative;
  height: 100%;
}
.split-pane__dragger {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  margin: 0 -.6rem;
  padding: 0;
  min-width: calc(2px + 1.2rem);
  border-right: .6rem solid transparent;
  border-left: .6rem solid transparent;
  background-color: var(--sfc-sandbox-border-color);
  background-clip: padding-box;
  transition: all .1s ease;
  &:hover {
    border-color: var(--sfc-sandbox-border-color-60);
    background-color: rgba(24, 24, 24, .6);
    &::before,
    &::after {
      opacity: 1;
    }
    &::before {
      transform: translateX(-50%);
    }
    &::after {
      transform: translateX(50%);
    }
  }
  &::before,
  &::after {
    box-sizing: border-box;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    position: absolute;
    top: 50%;
    pointer-events: none;
    letter-spacing: 0;
    font-family: Fira Code,monospace;
    font-variant-ligatures: normal!important;
    margin-top: -.5em;
    width: 2em;
    height: 1em;
    color: rgba(24, 24, 24, .6);
    line-height: 1em;
    opacity: 0;
    transition: all .1s ease;
  }
  &::before {
    right: 0;
    content: "<";
    text-align: right;
  }
  &::after {
    left: 0;
    content: ">";
  }
}
</style>
