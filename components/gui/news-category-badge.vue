<script setup lang="ts">
import { newsCategory2Label } from '@/composables/use-news-category'
import type { NewsCategory2LabelType } from '@/types/content-types'

const props = defineProps<{ category: NewsCategory2LabelType }>()

const categoryLabel = computed(() =>
  newsCategory2Label[props.category]
    ? newsCategory2Label[props.category].label
    : 'OTHER'
)
const categoryVariant = computed(() =>
  newsCategory2Label[props.category]
    ? newsCategory2Label[props.category].variant
    : 'dark'
)
</script>

<template>
  <b-badge :variant="categoryVariant" class="news-badge">
    <span>{{ categoryLabel }}</span>
  </b-badge>
</template>

<style lang="scss" scoped>
.news-badge {
  width: 5rem;
}
</style>
