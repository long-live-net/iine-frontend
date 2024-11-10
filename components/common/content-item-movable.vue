<script setup lang="ts">
import { debounce } from 'es-toolkit'

const position = defineModel<{ x: number; y: number }>('position', {
  required: true,
})

const isDragging = ref(false)
const columnCursor = computed(() => (isDragging.value ? 'grabbing' : 'grab'))
const startX = ref(0)
const startY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const positionX = ref(50)
const positionY = ref(50)
watch(
  position,
  () => {
    positionX.value = position.value.x
    positionY.value = position.value.y
  },
  {
    immediate: true,
    deep: true,
  }
)

const itemDraggableBaseFrame = ref<HTMLDivElement | null>(null)
const itemDraggableBaseFrameRect = ref<DOMRect | null>(null)
const getItemDraggableBaseframeRect = () => {
  if (itemDraggableBaseFrame.value) {
    itemDraggableBaseFrameRect.value =
      itemDraggableBaseFrame.value.getBoundingClientRect()
  }
}
const onWindowResize = debounce(() => {
  getItemDraggableBaseframeRect()
}, 400)

const getPercentOfWidth = (x: number) =>
  itemDraggableBaseFrameRect.value
    ? Math.round((x / itemDraggableBaseFrameRect.value.width) * 100)
    : 0
const getPercentOfHeight = (y: number) =>
  itemDraggableBaseFrameRect.value
    ? Math.round((y / itemDraggableBaseFrameRect.value.height) * 100)
    : 0

const isTouchDevice = ref(false)
onMounted(() => {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    isTouchDevice.value = true
  }
  watch(itemDraggableBaseFrame, getItemDraggableBaseframeRect, {
    immediate: true,
  })
  window.addEventListener('resize', onWindowResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
})

const endMove = () => {
  if (!isDragging.value) {
    return
  }
  isDragging.value = false

  if (offsetX.value === 0 && offsetY.value == 0) {
    return
  }
  positionX.value += getPercentOfWidth(offsetX.value)
  positionY.value += getPercentOfHeight(offsetY.value)
  offsetX.value = 0
  offsetY.value = 0
  position.value = {
    x: positionX.value,
    y: positionY.value,
  }
}

const onMouseDown = (event: MouseEvent) => {
  if (isTouchDevice.value) {
    return
  }
  if (isDragging.value) {
    return
  }
  startX.value = event.pageX
  startY.value = event.pageY
  isDragging.value = true
}
const onMouseMove = (event: MouseEvent) => {
  if (isTouchDevice.value) {
    return
  }
  if (!isDragging.value) {
    return
  }
  offsetX.value = event.pageX - startX.value
  offsetY.value = event.pageY - startY.value
}
const onMouseUp = () => {
  if (isTouchDevice.value) {
    return
  }
  endMove()
}
const onMouseLeave = () => {
  if (isTouchDevice.value) {
    return
  }
  endMove()
}

const onTouchStart = (event: TouchEvent) => {
  if (!isTouchDevice.value) {
    return
  }
  if (isDragging.value) {
    return
  }
  if (!event.touches || !event.touches[0]) return

  const touchObject = event.changedTouches[0]
  startX.value = touchObject.pageX
  startY.value = touchObject.pageY
  isDragging.value = true
}
const onTouchMove = (event: TouchEvent) => {
  if (!isTouchDevice.value) {
    return
  }
  if (!isDragging.value) {
    return
  }
  const touchObject = event.changedTouches[0]
  offsetX.value = touchObject.pageX - startX.value
  offsetY.value = touchObject.pageY - startY.value
}
const onTouchEnd = () => {
  if (!isTouchDevice.value) {
    return
  }
  endMove()
}
</script>

<template>
  <div
    ref="itemDraggableBaseFrame"
    class="item-draggable-base-frame"
    @mouseleave.prevent.stop="onMouseLeave"
  >
    <div
      class="item-dragable can-edit"
      @mousedown.prevent.stop="onMouseDown"
      @mouseup.prevent.stop="onMouseUp"
      @mousemove.prevent.stop="onMouseMove"
      @touchstart.prevent.stop="onTouchStart"
      @touchmove.prevent.stop="onTouchMove"
      @touchend.prevent.stop="onTouchEnd"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-draggable-base-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .item-dragable {
    position: absolute;
    top: calc(v-bind('`${positionY}% + ${offsetY}px`'));
    left: calc(v-bind('`${positionX}% + ${offsetX}px`'));
    transform: translate(-50%, -50%);
    -webkit-touch-callout: none;
  }

  .can-edit {
    border: 0.25rem dashed lightgrey;
    border-radius: 1rem;
    cursor: v-bind('columnCursor');
  }
}
</style>
