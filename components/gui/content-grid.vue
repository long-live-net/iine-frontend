<script setup lang="ts">
import { ContentType } from '@/types/content'

defineProps<{ contents: ContentType[] }>()
</script>

<template>
  <div>
    <div class="content-grid">
      <div
        v-for="content in contents"
        :key="content.id"
        class="content-grid__column"
      >
        <slot :content="content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 22rem));
  justify-items: center;
  justify-content: space-around;
  row-gap: 2rem;
  margin: 0 auto;
  max-width: 80rem;
  min-height: 18rem;
  &__column {
    padding: 1rem;
    width: 90%;
    text-align: center;
  }
}
</style>
