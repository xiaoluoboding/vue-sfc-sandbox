<template>
  <div
    ref="container"
    class="split-pane"
    :class="{ dragging, 'is-vertical': !isHorizontal }"
    :style="splitPaneStyle"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div class="split-pane__left" :style="leftStyle">
      <slot name="left" />
      <div class="dragger" :style="draggerStyle" @mousedown.prevent="dragStart" />
    </div>
    <div class="split-pane__right" :style="rightStyle">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, toRefs, computed, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'SplitPane',
  setup () {
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
      }
    }

    function dragEnd () {
      state.dragging = false
    }

    const onResize = () => {
      // TODO dynamic compute pane width
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
        ? { width: boundSplit() + '%', borderRight: '1px solid #ebebeb' }
        : { height: boundSplit() + '%', borderBottom: '1px solid #ebebeb' }
    })

    const rightStyle = computed(() => {
      return state.isHorizontal
        ? { width: (100 - boundSplit()) + '%' }
        : { height: (100 - boundSplit()) + '%' }
    })

    const draggerStyle = computed(() => {
      return state.isHorizontal
        ? { top: 0, bottom: 0, right: '-5px', width: '10px', cursor: 'ew-resize' }
        : { left: 0, right: 0, bottom: '-5px', height: '10px', cursor: 'ns-resize' }
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

<style scoped>
.split-pane {
  display: flex;
  height: 100%;
}
.split-pane.dragging {
  cursor: ew-resize;
}
.split-pane.dragging.is-vertical {
  cursor: ns-resize;
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
.dragger {
  position: absolute;
  z-index: 99;
}
</style>
