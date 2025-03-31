<script setup lang="ts">
import type {
  MenuCategoryType,
  MenuCategoryForm,
  ContentEditMode,
} from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    menuCategoryData?: MenuCategoryType | null
  }>(),
  {
    menuCategoryData: null,
  }
)
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
  <BaseConfirm
    v-if="editMode === 'delete'"
    v-model:comfirm="modal"
    message="本当に削除しますか？"
    exec-text="削除する"
    @cancel="modal = false"
    @confirm="onRemove"
  />
  <CommonContentEditDialog
    v-else
    v-model:modal="modal"
    :content-title="contentTitle"
    :edit-mode="editMode"
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
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>

<style lang="scss" scoped>
.menu-detail-form {
  width: 60dvw;
  min-width: 300px;
  max-width: 840px;

  @media only screen and (max-width: $grid-breakpoint-sm) {
    width: 75dvw;
  }
}
</style>
