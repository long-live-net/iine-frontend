<script setup lang="ts">
type SpinnerIconProps = {
  spinColor?: string
  fillColor?: string
  size?: string
}
withDefaults(defineProps<SpinnerIconProps>(), {
  spinColor: '#000',
  fillColor: 'currentColor',
  size: '1em',
})
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    class="spinner"
    :style="{ '--spinner-icon-size': size }"
  >
    <path
      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
      :fill="fillColor"
    />
    <path
      d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
      :fill="spinColor"
    />
  </svg>
</template>

<style scoped lang="scss">
svg.spinner {
  display: inline-block;
  width: var(--spinner-icon-size);
  height: var(--spinner-icon-size);
}
</style>
