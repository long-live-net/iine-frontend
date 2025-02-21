<script setup lang="ts">
import draggable from 'vuedraggable'
import type { MenuCategoryType } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{
  menuCategories: MenuCategoryType[]
}>()
const emit = defineEmits<{
  update: [contents: MenuCategoryType[]]
}>()

const categories = ref<MenuCategoryType[]>([])
watch(
  () => props.menuCategories,
  () => {
    categories.value = [...props.menuCategories]
  },
  {
    immediate: true,
  }
)

const onUpdate = () => {
  emit('update', categories.value)
  modal.value = false
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    title="並び替え"
    title-icon="mdi-arrow-up-down"
    title-icon-color="cinfo"
  >
    <div class="menu-category-posision-setting">
      <h4 class="mb-2">メニューカテゴリ</h4>
      <ClientOnly>
        <draggable
          :list="categories"
          group="menu-categories"
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
      ドラッグドロップして位置を変更できます
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
.menu-category-posision-setting {
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
