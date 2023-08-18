<script setup lang="ts">
import { newsCategory2Label } from '@/composables/use-news-category'
import type { NewsCategory2Label } from '@/composables/use-news-category'

const props = defineProps<{ category: NewsCategory2Label }>()

const categoryLabel = computed(
  () => newsCategory2Label[props.category] ?? 'OTHER'
)
const categoryColor = computed(() => {
  const category2Color = {
    I: 'info',
    S: 'success',
    W: 'warning',
    T: 'danger',
  }
  return category2Color[props.category] ?? 'dark'
})
</script>

<template>
  <span :variant="categoryColor" class="news-badge">
    <span>{{ categoryLabel }}</span>
  </span>
</template>

<style lang="scss" scoped>
.news-badge {
  width: 5rem;
}
</style>
