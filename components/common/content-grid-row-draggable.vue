<script setup lang="ts" generic="T extends ContentType">
import draggable from 'vuedraggable'
import type { ContentType } from '@/types/content'

const props = withDefaults(
  defineProps<{
    contents: T[]
    group?: string
    dense?: boolean
    guideLine?: boolean
  }>(),
  {
    group: undefined,
    dense: false,
    guideLine: false,
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
        :group="group"
        :fallback-tolerance="1"
        :force-fallback="true"
        :scroll-sensitivity="220"
        class="content-grid-row"
        :class="{
          dense,
          'g-theme-contents-item__draggable--guid-line': guideLine,
          'guide-line': guideLine,
        }"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <template #item="{ element, index }">
          <div
            class="content-grid__column column-draggable g-theme-contents-item__draggable"
          >
            <slot :content="element" :index="index" />
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

.content-grid-row {
  display: flex;
  flex-direction: column;
  row-gap: 3rem;
  margin: 0 auto;
  width: 90%;
  max-width: $contents-card-max-width;
  min-height: 12rem;
  &__column {
    width: 100%;
  }

  .column-draggable {
    position: relative;
    padding: 1rem;
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

.dense {
  row-gap: 2rem;
}

.guide-line {
  padding: 12px;
  border: 4px dashed var(--guid-line-border-color);
  border-radius: 6px;
}
</style>
