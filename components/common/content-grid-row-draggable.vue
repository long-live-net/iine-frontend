<script setup lang="ts" generic="T extends ContentType">
import draggable from 'vuedraggable'
import type { ContentType } from '@/types/content'

const props = defineProps<{ contents: T[] }>()
const emit = defineEmits<{
  update: [contents: T[]]
}>()

const draggableContents = computed({
  get: () => props.contents,
  set: (list) => {
    emit('update', list)
  },
})

const contentGridMaxWidth = '1140px'
const isDragging = ref(false)
const columnCursor = computed(() => (isDragging.value ? 'grabbing' : 'grab'))
</script>

<template>
  <div>
    <p class="draggable-notion g-theme-contents-item__draggable--notion">
      <v-icon icon="mdi-apps" size="x-large" />
      ドラッグドロップして位置を変更できます
    </p>
    <ClientOnly>
      <draggable
        v-model="draggableContents"
        item-key="id"
        handle=".draggable"
        class="content-grid-row"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <template #item="{ element, index }">
          <div
            class="content-grid__column column-draggable g-theme-contents-item__draggable"
          >
            <slot :content="element as T" :index="index" />
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
  margin-bottom: 2rem;
}

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
    cursor: v-bind('columnCursor');
  }
}
</style>
