<script setup lang="ts">
import type { PageSection } from '@/types/customer-setting'

export type HeaderItem = PageSection & {
  color?: string
  hoverColor?: string
  to: { name: string; hash?: string }
}
const props = defineProps<{ menuItem: HeaderItem }>()
const itemColor = computed(() => props.menuItem.color ?? 'white')
const itemHoverColor = computed(() => props.menuItem.hoverColor ?? 'skyblue')
</script>

<template>
  <p class="header-item">
    <nuxt-link :to="menuItem.to">
      {{ menuItem.menuTitle ?? menuItem.title }}
    </nuxt-link>
  </p>
</template>

<style scoped lang="scss">
.header-item {
  font-weight: bold;
  font-size: 1rem;
  :deep(a) {
    font-weight: bold;
    color: v-bind(itemColor) !important;
  }
  :deep(a:hover) {
    color: v-bind(itemHoverColor) !important;
  }
}
</style>
