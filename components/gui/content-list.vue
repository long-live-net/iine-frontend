<script setup lang="ts">
import { ContentType } from '@/types/content-types'

defineProps<{ contents: ContentType[] }>()
</script>

<template>
  <ul class="content-list">
    <li v-for="content in contents" :key="content.id">
      <slot :content="content" />
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
