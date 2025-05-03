<script setup lang="ts" generic="T extends ContentType">
import draggable from 'vuedraggable'
import type { ContentType } from '@/types/content'

const props = withDefaults(
  defineProps<{
    contents: T[]
    narrow?: boolean
  }>(),
  {
    narrow: false,
  }
)
const emit = defineEmits<{
  update: [contents: T[]]
}>()

const draggableContents = computed({
  get: () => props.contents,
  set: (list) => {
    emit('update', list)
  },
})

const isNarrow = toRef(props, 'narrow')
const useGrid = computed(() => props.contents.length > 2)
const gridColumnMinDivide = isNarrow.value ? 4.8 : 4.4
const gridColumnMaxDivide = isNarrow.value ? 3.8 : 3.4
const flexColumnDivide = computed(() =>
  isNarrow.value
    ? 3.0
    : props.contents.length <= 1
      ? 2
      : props.contents.length * 1.4
)

const isDragging = ref(false)
const columnCursor = computed(() => (isDragging.value ? 'grabbing' : 'grab'))
</script>

<template>
  <div>
    <p class="draggable-notion g-theme-contents-item__draggable--notion">
      <v-icon icon="mdi-apps" size="x-large" />
      ドラッグして位置を変更できます
    </p>
    <ClientOnly>
      <draggable
        v-model="draggableContents"
        item-key="id"
        handle=".draggable"
        :fallback-tolerance="1"
        :force-fallback="true"
        :scroll-sensitivity="220"
        class="content-grid-base"
        :class="{ 'content-grid': useGrid, 'content-grid-flex': !useGrid }"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <template #item="{ element }">
          <div class="column column-draggable g-theme-contents-item__draggable">
            <slot :content="element" />
            <div
              class="edit-position-top draggable g-theme-contents-item__draggable--notion"
            >
              <v-icon icon="mdi-apps" size="x-large" />
            </div>
            <div
              class="edit-position-bottom draggable g-theme-contents-item__draggable--notion"
            >
              <v-icon icon="mdi-apps" size="x-large" />
            </div>
            <div
              class="edit-position-left-bottom draggable g-theme-contents-item__draggable--notion"
            >
              <v-icon icon="mdi-apps" size="x-large" />
            </div>
          </div>
        </template>
      </draggable>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.draggable-notion {
  text-align: center;
  font-size: small;
  font-weight: bold;
  margin: 1rem 0;
}

.content-grid-base {
  .column-draggable {
    position: relative;
    border-radius: 6px;

    .edit-position-top {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    .edit-position-bottom {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
    }

    .edit-position-left-bottom {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
    }
  }

  .draggable {
    user-select: none;
    cursor: v-bind('columnCursor');
  }
}

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
  column-gap: 3rem;
  row-gap: 3rem;
  width: 90%;
  max-width: $grid-max-width;
  min-height: 18rem;
  margin: 0 auto;

  .column {
    padding: 1.5rem 0.75rem 2.5rem 0.75rem;
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
  max-width: $grid-max-width;
  min-height: 18rem;
  margin: 0 auto;

  .column {
    flex: 0 1 calc($grid-max-width / v-bind('flexColumnDivide') - 1.25rem);
    padding: 1.5rem 0.75rem 2.5rem 0.75rem;
  }
}
</style>
