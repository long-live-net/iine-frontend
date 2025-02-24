<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

const props = withDefaults(
  defineProps<{
    contents: Readonly<T[]>
    small?: boolean
    smallIfPossible?: boolean
  }>(),
  {
    small: false,
    smallIfPossible: false,
  }
)

const useGrid = computed(() => props.contents.length > 2)
const isSmall = computed(
  () => props.small || (props.smallIfPossible && props.contents.length !== 3)
)
const gridColumnMinDivide = computed(() => (isSmall.value ? 5.6 : 4.4))
const gridColumnMaxDivide = computed(() => (isSmall.value ? 4.8 : 3.6))
const flexColumnDivide = computed(() =>
  isSmall.value ? 3 : props.contents.length < 2 ? 1.5 : props.contents.length
)
</script>

<template>
  <div>
    <div :class="{ 'content-grid': useGrid, 'content-grid-flex': !useGrid }">
      <div v-for="content in contents" :key="content.id" class="column">
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
    minmax(
      calc($contents-card-max-width / v-bind('gridColumnMinDivide')),
      calc($contents-card-max-width / v-bind('gridColumnMaxDivide'))
    )
  );
  justify-items: center;
  justify-content: space-around;
  column-gap: 3rem;
  row-gap: 3rem;
  width: 90%;
  max-width: $contents-card-max-width;
  min-height: 18rem;
  margin: 0 auto;

  .column {
    padding: 0;
    width: 100%;
  }
}

.content-grid-flex {
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  justify-content: center;
  gap: 2.5rem;
  width: 90%;
  max-width: $contents-card-max-width;
  min-height: 18rem;
  margin: 0 auto;

  .column {
    flex: 0 1
      calc($contents-card-max-width / v-bind('flexColumnDivide') - 1.25rem);
    padding: 0;
  }
}
</style>
