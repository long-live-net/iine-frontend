<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

withDefaults(
  defineProps<{
    contents: Readonly<T[]>
    gridMinWidth?: string
    gridMaxWidth?: string
  }>(),
  {
    gridMinWidth: '16rem',
    gridMaxWidth: '22rem',
  }
)
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
  grid-template-columns: repeat(
    auto-fill,
    minmax(v-bind(gridMinWidth), v-bind(gridMaxWidth))
  );
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
