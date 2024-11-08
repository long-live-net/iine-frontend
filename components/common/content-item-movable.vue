<script setup lang="ts">
import { debounce } from 'es-toolkit'

const position = defineModel<{ x: number; y: number }>('position', {
  required: true,
})
const props = withDefaults(defineProps<{ canEdit?: boolean }>(), {
  canEdit: false,
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

onMounted(() => {
  watch(itemDraggableBaseFrame, getItemDraggableBaseframeRect, {
    immediate: true,
  })
  window.addEventListener('resize', onWindowResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
})

const onMouseDown = (event: MouseEvent) => {
  if (!props.canEdit) {
    return
  }
  if (isDragging.value) {
    return
  }
  startX.value = event.pageX
  startY.value = event.pageY
  isDragging.value = true
}
const onMouseUp = () => {
  if (!props.canEdit) {
    return
  }
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
const onMouseLeave = () => {
  if (!props.canEdit) {
    return
  }
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
const onMouseMove = (event: MouseEvent) => {
  if (!props.canEdit) {
    return
  }
  if (!isDragging.value) {
    return
  }
  offsetX.value = event.pageX - startX.value
  offsetY.value = event.pageY - startY.value
}
</script>

<template>
  <div
    ref="itemDraggableBaseFrame"
    class="item-draggable-base-frame"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div
      class="item-dragable"
      :class="{ 'can-edit': canEdit }"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
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

  .item-dragable {
    position: absolute;
    top: calc(v-bind('`${positionY}% + ${offsetY}px`'));
    left: calc(v-bind('`${positionX}% + ${offsetX}px`'));
    transform: translate(-50%, -50%);
  }

  .can-edit {
    border: 0.25rem dashed lightgrey;
    border-radius: 1rem;
    cursor: v-bind('columnCursor');
  }
}
</style>
