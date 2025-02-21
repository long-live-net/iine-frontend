<script setup lang="ts" generic="T extends ContentType">
import type { ContentType } from '@/types/content'

const editModal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    items?: T[] | null
    canEdit?: boolean
    small?: boolean
  }>(),
  {
    items: null,
    canEdit: false,
    small: false,
  }
)
defineEmits<{
  create: []
  update: [item: T]
  updatePositions: [items: T[]]
}>()

const gridMinWidth = computed(() => (props.small ? '14rem' : undefined))
const gridMaxWidth = computed(() => (props.small ? '18rem' : undefined))
const contentGridMaxWidth = computed(() =>
  props.small && props.items && props.items.length < 4 ? '60rem' : undefined
)
</script>

<template>
  <div v-if="canEdit" class="content-grid-list-editable">
    <CommonContentGridDraggable
      v-if="items?.length"
      :contents="items"
      @update="$emit('updatePositions', $event)"
    >
      <template #default="{ content }">
        <div class="content-item">
          <slot :content="content" />

          <div class="edit-activator">
            <CommonContentEditActivator
              v-model:modal="editModal"
              is-update
              activator-size="x-small"
              @update:modal="$emit('update', content)"
            />
          </div>
        </div>
      </template>
    </CommonContentGridDraggable>
    <div v-else class="no-items">
      <p>データがありません</p>
      <div>
        <CommonContentEditActivator
          v-model:modal="editModal"
          activator-label="コンテンツを登録してください"
          @update:modal="$emit('create')"
        />
      </div>
    </div>
    <div v-if="items?.length" class="create-activator">
      <CommonContentEditActivator
        v-model:modal="editModal"
        @update:modal="$emit('create')"
      />
    </div>
  </div>
  <div v-else>
    <CommonContentGrid
      v-if="items?.length"
      :contents="items"
      :content-grid-max-width="contentGridMaxWidth"
      :grid-min-width="gridMinWidth"
      :grid-max-width="gridMaxWidth"
    >
      <template #default="{ content }">
        <slot :content="content" />
      </template>
    </CommonContentGrid>
    <div v-else class="no-items">
      <p>データがありません</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-grid-list-editable {
  position: relative;
  padding: 0.2rem;

  .create-activator {
    position: absolute;
    top: -1rem;
    right: 5rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      right: 1rem;
    }
  }
}

.content-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: -8px;
    left: 4px;
  }
}

.no-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1rem;

  p {
    font-weight: bold;
    color: $accent;
  }
}
</style>
