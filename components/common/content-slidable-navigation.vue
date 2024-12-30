<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    preUrl?: string | null
    nextUrl?: string | null
  }>(),
  {
    preUrl: null,
    nextUrl: null,
  }
)

const slidableTargetRef = ref<HTMLDivElement | null>(null)
const slidableCenterHeight = ref(400)
const getSlidableCenterHeight = () => {
  const height = slidableTargetRef.value?.getBoundingClientRect()?.height
  if (height) {
    slidableCenterHeight.value = height
  }
}
onMounted(() => {
  getSlidableCenterHeight()
})

const router = useRouter()
const isDragging = ref(false)
const startX = ref(0)
const offsetX = ref(0)

const endMove = () => {
  if (!isDragging.value) {
    return
  }
  isDragging.value = false

  if (offsetX.value > 120) {
    if (props.preUrl) {
      router.push(props.preUrl)
    }
  } else if (offsetX.value < -120) {
    if (props.nextUrl) {
      router.push(props.nextUrl)
    }
  }
  offsetX.value = 0
}

const onMouseDown = (event: MouseEvent) => {
  if (isTouchDevice.value) {
    return
  }
  if (isDragging.value) {
    return
  }
  getSlidableCenterHeight()
  startX.value = event.pageX
  isDragging.value = true
}
const onMouseMove = (event: MouseEvent) => {
  if (isTouchDevice.value) {
    return
  }
  if (!isDragging.value) {
    return
  }
  const idou = event.pageX - startX.value
  if (Math.abs(idou) > 60) {
    offsetX.value = idou
  }
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

const { isTouchDevice } = useDetectTouchDevice()
const onTouchStart = (event: TouchEvent) => {
  if (!isTouchDevice.value) {
    return
  }
  if (isDragging.value) {
    return
  }
  if (!event.touches || !event.touches[0]) return
  getSlidableCenterHeight()
  const touchObject = event.changedTouches[0]
  startX.value = touchObject.pageX
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
  const idou = touchObject.pageX - startX.value
  if (Math.abs(idou) > 60) {
    offsetX.value = idou
    event.preventDefault()
  }
}
const onTouchEnd = () => {
  if (!isTouchDevice.value) {
    return
  }
  endMove()
}

const translation = computed(() => `-100% + ${offsetX.value}px`)
const columnCursor = computed(() => (isDragging.value ? 'grabbing' : 'grab'))
</script>

<template>
  <div
    class="content-slidable-navigation"
    @mousedown.stop="onMouseDown"
    @mouseup.stop="onMouseUp"
    @mousemove.stop="onMouseMove"
    @mouseleave.stop="onMouseLeave"
    @touchstart.stop="onTouchStart"
    @touchmove.stop="onTouchMove"
    @touchend.stop="onTouchEnd"
  >
    <div class="slidable-container">
      <div class="slidable pre-next">
        <div
          class="g-theme-slidable-item"
          :class="[preUrl ? 'has-item' : 'no-item']"
        >
          <h3 v-show="preUrl" style="text-align: right">
            <v-icon icon="mdi-arrow-left-drop-circle" :size="38" />
            ・・・前へ
          </h3>
        </div>
      </div>
      <div id="slidable-target" ref="slidableTargetRef" class="slidable target">
        <slot />
      </div>
      <div class="slidable pre-next">
        <div
          class="g-theme-slidable-item"
          :class="[nextUrl ? 'has-item' : 'no-item']"
        >
          <h3 v-show="nextUrl">
            次へ・・・
            <v-icon icon="mdi-arrow-right-drop-circle" :size="38" />
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-slidable-navigation {
  width: 100%;
  overflow: hidden;
  cursor: v-bind('columnCursor');

  .slidable-container {
    display: flex;
    transform: translateX(calc(v-bind('translation')));

    .slidable {
      display: block;
      flex: 0 0 100%;
      padding: 0;
      width: 100%;
      min-height: 400px;
    }

    .pre-next {
      padding: 0 3rem;

      .has-item {
        height: v-bind('`${slidableCenterHeight}px`');
        padding: 2rem;
        border-radius: 1rem;

        @media only screen and (max-width: $grid-breakpoint-md) {
          border-radius: 0.25rem;
        }
      }
      .no-item {
        background-color: transparent;
      }
    }
  }
}
</style>
