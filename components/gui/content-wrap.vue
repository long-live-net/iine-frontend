<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    loadingColor?: string
    loadingSize?: string | number
    loadingWidth?: number
  }>(),
  {
    loading: false,
  }
)
</script>

<template>
  <div class="content-wrap">
    <GuiBaseOverlayCircleWrap
      :overlay="loading"
      :color="loadingColor"
      :size="loadingSize"
      :width="loadingWidth"
    >
      <slot />
    </GuiBaseOverlayCircleWrap>
  </div>
</template>

<style lang="scss" scoped>
.content-wrap {
  width: 100%;
  min-width: 18rem;
}
</style>
