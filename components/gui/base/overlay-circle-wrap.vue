<script setup lang="ts">
withDefaults(
  defineProps<{
    overlay?: boolean
    color?: string
    size?: string | number
    width?: number
  }>(),
  {
    overlay: false,
    color: 'yellow',
    size: 'default',
    width: 4,
  }
)
</script>

<template>
  <div class="overlay-wrapper">
    <slot />
    <div class="not-buzy" :class="{ 'now-buzy': overlay }">
      <v-progress-circular
        indeterminate
        :color="color"
        :size="size"
        :width="width"
      />
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
    align-items: center;
    z-index: 10;
  }
}
</style>
