<script setup lang="ts">
withDefaults(
  defineProps<{
    overlay?: boolean
    color?: string
    height?: number
  }>(),
  {
    overlay: false,
    color: 'yellow-lighten-1',
    height: 4,
  }
)
</script>

<template>
  <div class="overlay-not-buzy" :class="{ 'overlay-now-buzy': overlay }">
    <v-progress-linear indeterminate :color="color" :height="height" />
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
  align-items: flex-end;
  z-index: 10;
}
</style>
