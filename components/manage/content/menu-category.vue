<script setup lang="ts">
import type { MenuCategoryType, MenuCategoryForm } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{ menuCategoryData?: MenuCategoryType | null }>()
const emit = defineEmits<{
  create: [inputData: MenuCategoryForm]
  update: [{ id: string; formData: MenuCategoryForm }]
  remove: [id: string]
}>()

const { handleSubmit, handleReset, formData, resetMenuCategoryForm } =
  useMenuCategoryForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetMenuCategoryForm(props.menuCategoryData)
  }
})

const onCreate = handleSubmit((MenuCategoryForm) => {
  emit('create', MenuCategoryForm)
  modal.value = false
})

const onUpdate = handleSubmit((MenuCategoryForm) => {
  if (!props.menuCategoryData?.id) {
    return
  }
  emit('update', {
    id: props.menuCategoryData?.id,
    formData: MenuCategoryForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.menuCategoryData?.id) {
    return
  }
  emit('remove', props.menuCategoryData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditDialog
    v-model:modal="modal"
    :is-update="!!menuCategoryData?.id"
  >
    <v-form class="menu-detail-form">
      <div class="mt-3">
        <v-text-field
          v-model="formData.category.value.value"
          :error-messages="formData.category.errorMessage.value"
          clearable
          label="メニューカテゴリー名"
          placeholder="カテゴリー名を入力してください"
        />
      </div>
      <ManageContentFormActions
        :content-id="menuCategoryData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
