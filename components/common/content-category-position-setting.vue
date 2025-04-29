<script setup lang="ts" generic="T extends ContentCategoryType">
import type { ContentCategoryType } from '@/types/content'
import draggable from 'vuedraggable'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{ categories: T[]; contentTitle: string }>()
const emit = defineEmits<{ update: [contents: T[]] }>()

const categoriesRef = ref<T[]>([]) as Ref<T[]>
watch(
  () => props.categories,
  () => {
    categoriesRef.value = [...props.categories]
  },
  {
    immediate: true,
  }
)

const onUpdate = () => {
  emit('update', categoriesRef.value)
  modal.value = false
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    title="並替え"
    title-icon="mdi-sort-reverse-variant"
    title-icon-color="info"
  >
    <div class="category-posision-setting">
      <h4 class="mb-2">{{ contentTitle }}</h4>
      <ClientOnly>
        <draggable
          :list="categoriesRef"
          item-key="id"
          handle=".drag-handle"
          class="drag-group"
        >
          <template #item="{ element }">
            <div
              class="drag-group__item drag-handle g-theme-contents-item__draggable"
            >
              <p class="g-theme-contents-item__draggable--notion">
                <v-icon icon="mdi-apps" />
              </p>
              <p class="mx-3">{{ element.category }}</p>
              <p
                class="g-theme-contents-item__draggable--notion"
                style="margin-left: auto"
              >
                <v-icon icon="mdi-apps" />
              </p>
            </div>
          </template>
        </draggable>
      </ClientOnly>
    </div>
    <div
      class="g-theme-contents-item__draggable--notion"
      style="margin-top: 1rem; text-align: center; font-size: small"
    >
      <v-icon icon="mdi-apps" />
      ドラッグして位置を変更できます
    </div>

    <div class="d-flex justify-end mt-6">
      <div>
        <v-btn
          prepend-icon="mdi-content-save"
          color="info"
          variant="flat"
          width="8rem"
          @click="onUpdate"
        >
          変更する
        </v-btn>
      </div>
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.category-posision-setting {
  width: 400px;
  max-width: 100%;

  .drag-group {
    min-height: 200px;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;

    &__item {
      display: flex;
      padding: 0.5rem;
    }

    .drag-handle {
      cursor: grab;
    }
  }
}
</style>
