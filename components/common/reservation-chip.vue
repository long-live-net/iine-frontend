<script setup lang="ts">
defineProps<{ url?: string | null }>()
</script>

<template>
  <a
    :href="url ?? ''"
    target="_blank"
    rel="noopener noreferrer"
    class="reservation-chip"
    ><slot
  /></a>
</template>

<style lang="scss" scoped>
.reservation-chip {
  display: block;
  text-align: center;
  color: white !important;
  background-color: lightseagreen;
  font-weight: bold;
  white-space: nowrap;
  transition: background-color 0.25s linear;
  &:hover {
    background-color: $link-normal2;
  }
}
</style>
