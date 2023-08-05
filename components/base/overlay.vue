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
  <div class="overlay-not-buzy" :class="{ 'overlay-now-buzy': overlay }">
    <v-progress-circular
      indeterminate
      :color="color"
      :size="size"
      :width="width"
    />
  </div>
</template>

<style lang="scss" scoped>
.overlay-not-buzy {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.overlay-now-buzy {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>
