<script setup lang="ts" generic="T extends ContentType">
import type { ContentType, ContentEditMode } from '@/types/content'

const editModal = defineModel<boolean>('modal', { required: true })
withDefaults(
  defineProps<{
    items: T[] | null
    contentTitle: string
    canEdit?: boolean
    small?: boolean
    smallIfPossible?: boolean
  }>(),
  {
    canEdit: false,
    small: false,
    smallIfPossible: false,
  }
)
defineEmits<{
  editTarget: [target: { item: T | null; mode: ContentEditMode }]
  updatePositions: [items: T[]]
}>()
</script>

<template>
  <div class="content-grid-table">
    <div v-if="canEdit" class="content-grid-table-editable">
      <CommonContentGridDraggable
        v-if="items?.length"
        :contents="items"
        @update="$emit('updatePositions', $event)"
      >
        <template #default="{ content }">
          <div class="content-item">
            <slot :content="content" />

            <div class="edit-activator">
              <div class="activators">
                <CommonContentEditActivator
                  v-model:modal="editModal"
                  :content-title="contentTitle"
                  edit-mode="update"
                  size="x-small"
                  @update:modal="
                    $emit('editTarget', { item: content, mode: 'update' })
                  "
                />
                <CommonContentEditActivator
                  v-model:modal="editModal"
                  :content-title="contentTitle"
                  edit-mode="delete"
                  size="x-small"
                  @update:modal="
                    $emit('editTarget', { item: content, mode: 'delete' })
                  "
                />
              </div>
            </div>
          </div>
        </template>
      </CommonContentGridDraggable>
      <div v-else class="no-items">
        <p>データがありません</p>
        <div class="d-flex align-center">
          <CommonContentEditActivator
            v-model:modal="editModal"
            :content-title="contentTitle"
            edit-mode="new"
            @update:modal="$emit('editTarget', { item: null, mode: 'new' })"
          />
          <p class="ml-2">
            このボタンから{{ contentTitle }}を登録してください。
          </p>
        </div>
      </div>
      <div v-if="items?.length" class="create-activator">
        <CommonContentEditActivator
          v-model:modal="editModal"
          :content-title="contentTitle"
          edit-mode="new"
          @update:modal="$emit('editTarget', { item: null, mode: 'new' })"
        />
      </div>
    </div>
    <div v-else>
      <CommonContentGrid
        v-if="items?.length"
        :contents="items"
        :small="small"
        :small-if-possible="smallIfPossible"
      >
        <template #default="{ content }">
          <slot :content="content" />
        </template>
      </CommonContentGrid>
      <div v-else class="no-items">
        <p>データがありません</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-grid-table {
  padding-top: 0.5rem;

  .content-grid-table-editable {
    position: relative;
    padding: 0.2rem;

    .create-activator {
      position: absolute;
      top: 0;
      right: 6rem;

      @media only screen and (max-width: $grid-breakpoint-lg) {
        right: 1rem;
      }
    }
  }

  .content-item {
    position: relative;

    .edit-activator {
      position: absolute;
      top: -12px;
      left: 0;

      .activators {
        display: flex;
        column-gap: 0.25rem;
      }
    }
  }

  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;

    p {
      font-weight: bold;
      color: var(--warning-color);
    }
  }
}
</style>
