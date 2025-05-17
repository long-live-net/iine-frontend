<script setup lang="ts">
import chroma from 'chroma-js'
import type { NewsCategory } from '@/types/content'
const props = defineProps<{ category: NewsCategory; small?: boolean }>()

const getTextColor = (colorText: string) => {
  const luminance = chroma(colorText).luminance()
  if (luminance > 0.5) {
    return 'black'
  } else {
    return 'white'
  }
}

const categoryBkColor = computed(() => props.category.color)
const categoryColor = computed(() => getTextColor(props.category.color))
</script>

<template>
  <p class="news-badge">
    {{ category.name }}
  </p>
</template>

<style lang="scss" scoped>
.news-badge {
  width: 6rem;
  font-size: small;
  font-weight: bold;
  text-align: center;
  color: v-bind('categoryColor');
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: v-bind('categoryBkColor');
  border-radius: 6px;
}
</style>
