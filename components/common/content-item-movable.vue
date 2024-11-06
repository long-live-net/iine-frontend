<script setup lang="ts">
import { debounce } from 'es-toolkit'
import {
  positionStringToValues,
  positionValuesToString,
} from '@/composables/use-content/use-base-content'

const positionString = defineModel<string | null | undefined>('positionString')
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
  () => positionString,
  () => {
    if (positionString.value) {
      const pos = positionStringToValues(positionString.value)
      positionX.value = pos.x
      positionY.value = pos.y
    }
  },
  {
    immediate: true,
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
  if (!isDragging.value && props.canEdit) {
    startX.value = event.pageX
    startY.value = event.pageY
    isDragging.value = true
  }
}
const onMouseUp = () => {
  if (isDragging.value && props.canEdit) {
    positionX.value += getPercentOfWidth(offsetX.value)
    positionY.value += getPercentOfHeight(offsetY.value)
    offsetX.value = 0
    offsetY.value = 0
    positionString.value = positionValuesToString(
      positionX.value,
      positionY.value
    )
  }
  isDragging.value = false
}
const onMouseLeave = () => {
  if (isDragging.value && props.canEdit) {
    positionX.value += getPercentOfWidth(offsetX.value)
    positionY.value += getPercentOfHeight(offsetY.value)
    offsetX.value = 0
    offsetY.value = 0
    positionString.value = positionValuesToString(
      positionX.value,
      positionY.value
    )
  }
  isDragging.value = false
}
const onMouseMove = (event: MouseEvent) => {
  if (isDragging.value && props.canEdit) {
    offsetX.value = event.pageX - startX.value
    offsetY.value = event.pageY - startY.value
  }
}

const settingsLeft = computed(() => {
  if (positionX.value > 50) {
    return '-3.5rem'
  } else {
    return 'auto'
  }
})
const settingsRight = computed(() =>
  settingsLeft.value === 'auto' ? '-3.5rem' : 'auto'
)
</script>

<template>
  <div
    ref="itemDraggableBaseFrame"
    class="item-draggable-base-frame"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div class="item-dragable" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <div class="item-container" :class="{ 'can-edit': canEdit }">
        <slot />
        <div v-if="canEdit" class="item-container__settings">
          <slot name="setting" />
        </div>
      </div>
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

    .item-container {
      position: relative;

      &__settings {
        position: absolute;
        top: -0.5rem;
        left: v-bind('settingsLeft');
        right: v-bind('settingsRight');
      }
    }

    .can-edit {
      border: 0.25rem dashed lightgrey;
      border-radius: 1rem;
      cursor: v-bind('columnCursor');
    }
  }
}
</style>
