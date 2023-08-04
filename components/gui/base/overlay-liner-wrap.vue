<script setup lang="ts">
withDefaults(
  defineProps<{
    overlay?: boolean
    color?: string
    height?: number
  }>(),
  {
    overlay: false,
    color: 'yellow',
    height: 4,
  }
)
</script>

<template>
  <div class="overlay-wrapper">
    <slot />
    <div class="not-buzy" :class="{ 'now-buzy': overlay }">
      <v-progress-linear indeterminate :color="color" :height="height" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay-wrapper {
  position: relative;
  .not-buzy {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .now-buzy {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 10;
  }
}
</style>
