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
  <div class="contents-card g-theme-contents-card">
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
$contents-card-lg-max-width: 1140px;

.contents-card {
  width: 100%;
  min-width: 18rem;
  max-width: $contents-card-lg-max-width;
  margin: 0 auto;
  overflow: hidden;
}

@media only screen and (min-width: $grid-breakpoint-md) {
  .contents-card {
    width: 90%;
    border-radius: 12px;
  }
}
</style>
