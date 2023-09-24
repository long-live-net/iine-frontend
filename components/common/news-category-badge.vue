<script setup lang="ts">
import { newsCategory2Label } from '@/composables/use-news-category'
import type { NewsCategory2Label } from '@/composables/use-news-category'

const props = defineProps<{
  category: NewsCategory2Label
  small?: boolean
}>()

const categoryLabel = computed(
  () => newsCategory2Label[props.category] ?? 'OTHER'
)
const categoryBkColor = computed(() => {
  const category2BkColor = {
    I: '#2196f3',
    S: '#4caf50',
    W: '#fabe00',
    T: '#ff5252',
  }
  return category2BkColor[props.category] ?? '#666666'
})
const categoryColor = computed(() => {
  const category2Color = {
    I: 'white',
    S: 'white',
    W: 'black',
    T: 'white',
  }
  return category2Color[props.category] ?? 'white'
})
</script>

<template>
  <p class="news-badge">
    <span>
      {{ categoryLabel }}
    </span>
  </p>
</template>

<style lang="scss" scoped>
.news-badge {
  display: inline-block;
  width: 5rem;
  font-size: small;
  font-weight: bold;
  text-align: center;
  color: v-bind('categoryColor');
  background-color: v-bind('categoryBkColor');
  border-radius: 6px;
}
</style>
