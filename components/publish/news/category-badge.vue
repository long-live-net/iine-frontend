<script setup lang="ts">
const props = defineProps<{ category: string; small?: boolean }>()

const { getCategory2BkColor, getCategory2Color } = useNewsCategory()
const categoryBkColor = computed(() => getCategory2BkColor(props.category))
const categoryColor = computed(() => getCategory2Color(props.category))
</script>

<template>
  <p class="news-badge">
    <span>
      {{ category }}
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
