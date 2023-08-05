<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    loading?: boolean
    loadingSize?: 'large' | 'default' | 'small'
  }>(),
  { loading: false }
)

const overlayColor = 'yellow'
const overlaySize =
  props.loadingSize === 'large' ? 140 : props.loadingSize === 'small' ? 40 : 88
const overlayWidth =
  props.loadingSize === 'large' ? 20 : props.loadingSize === 'small' ? 4 : 14
</script>

<template>
  <div class="content-wrap">
    <slot />
    <GuiBaseOverlay
      :overlay="loading"
      :color="overlayColor"
      :size="overlaySize"
      :width="overlayWidth"
    />
  </div>
</template>

<style lang="scss" scoped>
.content-wrap {
  position: relative;
  width: 100%;
  min-width: 18rem;
}
</style>
