<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    thresholds?: number[]
    animationName?: string
    animationDuration?: string
    animationDelay?: string
    disabled?: boolean
  }>(),
  {
    thresholds: () => [0.25],
    animationName: 'gFadeIn',
    animationDuration: '1.5s',
    animationDelay: '0s',
    disabled: false,
  }
)

const { canEdit } = useCustomerPageContext()
const noAnimation = computed(() => canEdit.value || props.disabled)
const isAppear = ref(false)
const onIntersectImage = (isIntersecting: boolean) => {
  if (isIntersecting) {
    isAppear.value = true
  }
}
</script>

<template>
  <div
    v-intersect="{
      handler: onIntersectImage,
      options: {
        threshold: thresholds,
      },
    }"
    :class="{
      'g-animation-initial-effect': !noAnimation,
    }"
    :style="{
      'animation-name': noAnimation || !isAppear ? 'none' : animationName,
      'animation-duration': animationDuration,
      'animation-delay': animationDelay,
    }"
  >
    <slot />
  </div>
</template>
