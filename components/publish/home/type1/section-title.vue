<script setup lang="ts">
const { title = '' } = defineProps<{ title?: string }>()
</script>

<template>
  <h3 v-if="title?.length" class="section-title">
    <span>{{ title }}</span>
  </h3>
</template>

<style scoped lang="scss">
h3.section-title {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  span {
    background: linear-gradient(transparent 75%, orange 75%);
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>
