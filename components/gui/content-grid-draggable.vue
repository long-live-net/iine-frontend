<script setup lang="ts">
import draggable from 'vuedraggable'
import { ContentType } from '@/types/content'

const props = defineProps<{ contents: ContentType[] }>()
const emit = defineEmits<{
  update: [contents: ContentType[]]
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
    <p class="draggable-notion g-theme-contets-item__draggable--notion">
      ドラッグドロップで位置を変更できます
    </p>
    <ClientOnly>
      <draggable
        v-model="draggableContents"
        item-key="id"
        class="content-grid"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <template #item="{ element }">
          <section
            class="content-grid__column column-draggable g-theme-contets-item__draggable"
          >
            <slot :content="element" />
            <div class="edit-position">
              <v-icon icon="mdi-drag" size="x-large" color="grey-darken-2" />
            </div>
          </section>
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
    padding: 1.5rem 1.5rem 2.5rem 1.5rem;
    width: 90%;
    text-align: center;
  }
  .column-draggable {
    position: relative;
    width: 92% !important;
    border-radius: 6px;
    cursor: v-bind('columnCursor');
    .edit-position {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
    }
  }
}
</style>
