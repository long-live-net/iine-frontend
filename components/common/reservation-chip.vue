<script setup lang="ts">
defineProps<{ url?: string | null }>()
</script>

<template>
  <nuxt-link
    :to="url ?? ''"
    target="_blank"
    rel="nofollow noopener noreferrer"
    class="reservation-chip"
    ><slot
  /></nuxt-link>
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
    background-color: var(--link-active-color);
    text-decoration: none;
  }
}
</style>
