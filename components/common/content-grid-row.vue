<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

withDefaults(
  defineProps<{
    contents: Readonly<T[]>
    contentGridMaxWidth?: string
  }>(),
  {
    contentGridMaxWidth: '1140px',
  }
)
</script>

<template>
  <div>
    <div class="content-grid-row">
      <div
        v-for="(content, idx) in contents"
        :key="content.id"
        class="content-grid-row__column"
      >
        <slot :content="content" :index="idx" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-grid-row {
  display: flex;
  flex-direction: column;
  row-gap: 3rem;
  margin: 0 auto;
  width: 90%;
  max-width: v-bind('contentGridMaxWidth');
  min-height: 10rem;
  &__column {
    width: 100%;
  }

  @media only screen and (max-width: $grid-breakpoint-md) {
    row-gap: 1.5rem;
    width: 100%;
  }
}
</style>
