<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

const props = withDefaults(
  defineProps<{
    contents: Readonly<T[]>
    narrow?: boolean
    small?: boolean
  }>(),
  {
    narrow: false,
    small: false,
  }
)

const { isSmall: isSmallWindow, isJudged } = useMediaQueryIsSmall()
const isNarrow = toRef(props, 'narrow')
const isSmall = toRef(props, 'small')
const isXSmall = computed(
  () => isJudged.value && isSmallWindow.value && isSmall.value
)
const useGrid = computed(() =>
  isXSmall.value
    ? true
    : isSmall.value
      ? props.contents.length >= 4
      : props.contents.length >= 3
)
const gridColumnMinDivide = computed(() =>
  isXSmall.value ? 8.2 : isSmall.value ? 6 : isNarrow.value ? 4.6 : 4.4
)
const gridColumnMaxDivide = computed(() =>
  isXSmall.value ? 7.2 : isSmall.value ? 5 : isNarrow.value ? 3.6 : 3.4
)
const flexColumnDivide = computed(() =>
  isSmall.value
    ? 4.2
    : isNarrow.value
      ? 3.0
      : props.contents.length <= 1
        ? 2
        : props.contents.length * 1.4
)
const columnGap = computed(() =>
  isJudged.value && isSmallWindow.value ? '0.5rem' : '2rem'
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
$grid-max-width: $contents-card-max-width;

.content-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      calc($grid-max-width / v-bind('gridColumnMinDivide')),
      calc($grid-max-width / v-bind('gridColumnMaxDivide'))
    )
  );
  justify-items: center;
  justify-content: space-around;
  column-gap: v-bind('columnGap');
  row-gap: 2rem;
  width: 90%;
  max-width: $grid-max-width;
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
  column-gap: v-bind('columnGap');
  row-gap: 2rem;
  width: 90%;
  max-width: $grid-max-width;
  min-height: 18rem;
  margin: 0 auto;

  .column {
    flex: 0 1 calc($grid-max-width / v-bind('flexColumnDivide') - 1.25rem);
    padding: 0;
  }
}
</style>
