<script setup lang="ts">
import type { ContentType } from '@/types/content'

defineProps<{ contents: Readonly<ContentType[]> }>()
</script>

<template>
  <ul class="content-list">
    <li v-for="(content, index) in contents" :key="content.id">
      <slot :content="content" :index="index" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul.content-list {
  li {
    margin: 0;
  }
}
</style>
