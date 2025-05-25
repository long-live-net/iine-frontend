<script setup lang="ts" generic="T extends ContentType">
import type { ContentType, ContentEditMode } from '@/types/content'

const editModal = defineModel<boolean>('modal', { required: true })
withDefaults(
  defineProps<{
    items?: T[] | null
    contentTitle: string
    canEdit?: boolean
  }>(),
  {
    items: null,
    canEdit: false,
  }
)
defineEmits<{
  editTarget: [target: { item: T | null; mode: ContentEditMode }]
  updatePositions: [items: T[]]
}>()
</script>

<template>
  <div v-if="canEdit" class="content-grid-list-editable">
    <CommonContentGridRowDraggable
      v-if="items?.length"
      :contents="items"
      @update="$emit('updatePositions', $event)"
    >
      <template #default="{ content, index }">
        <div class="content-item">
          <slot :content="content" :index="index" />

          <div class="edit-activator">
            <div class="activators">
              <CommonContentEditActivator
                v-model:modal="editModal"
                :content-title="contentTitle"
                edit-mode="update"
                activator-size="small"
                @update:modal="
                  $emit('editTarget', { item: content, mode: 'update' })
                "
              />
              <CommonContentEditActivator
                v-model:modal="editModal"
                :content-title="contentTitle"
                edit-mode="delete"
                size="small"
                @update:modal="
                  $emit('editTarget', { item: content, mode: 'delete' })
                "
              />
            </div>
          </div>
        </div>
      </template>
    </CommonContentGridRowDraggable>
    <div v-else class="no-items">
      <p>データがありません</p>
      <div class="d-flex align-center">
        <CommonContentEditActivator
          v-model:modal="editModal"
          :content-title="contentTitle"
          edit-mode="new"
          @update:modal="$emit('editTarget', { item: null, mode: 'new' })"
        />
      </div>
      <p class="ml-2">このボタンから{{ contentTitle }}を登録してください。</p>
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
    <CommonContentGridRow v-if="items?.length" :contents="items">
      <template #default="{ content, index }">
        <slot :content="content" :index="index" />
      </template>
    </CommonContentGridRow>
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
    top: 0rem;
    right: 30%;

    @media only screen and (max-width: $grid-breakpoint-lg) {
      right: 18%;
    }

    @media only screen and (max-width: $grid-breakpoint-sm) {
      right: 1rem;
    }
  }
}

.content-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 4px;
    left: 4px;

    @media only screen and (max-width: $grid-breakpoint-md) {
      top: -4px;
      left: -4px;
    }

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
  justify-content: center;
  height: 150px;
  row-gap: 1rem;

  p {
    font-weight: bold;
    color: var(--warning-color);
  }
}
</style>
