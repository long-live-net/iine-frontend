<script setup lang="ts">
import type {
  ShopCategoryType,
  ShopCategoryForm,
  ContentEditMode,
} from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    shopCategoryData?: ShopCategoryType | null
  }>(),
  {
    shopCategoryData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: ShopCategoryForm]
  update: [{ id: string; formData: ShopCategoryForm }]
  remove: [id: string]
}>()

const { handleSubmit, handleReset, formData, resetShopCategoryForm } =
  useShopCategoryForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetShopCategoryForm(props.shopCategoryData)
  }
})

const onCreate = handleSubmit((ShopCategoryForm) => {
  emit('create', ShopCategoryForm)
  modal.value = false
})

const onUpdate = handleSubmit((ShopCategoryForm) => {
  if (!props.shopCategoryData?.id) {
    return
  }
  emit('update', {
    id: props.shopCategoryData?.id,
    formData: ShopCategoryForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.shopCategoryData?.id) {
    return
  }
  emit('remove', props.shopCategoryData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentDeleteConfirm
    v-if="editMode === 'delete'"
    v-model:comfirm="modal"
    :content-title="contentTitle"
    @cancel="modal = false"
    @confirm="onRemove"
  />
  <CommonContentEditDialog
    v-else
    v-model:modal="modal"
    :content-title="contentTitle"
    :edit-mode="editMode"
  >
    <v-form class="shop-detail-form">
      <div class="mt-3">
        <v-text-field
          v-model="formData.category.value.value"
          :error-messages="formData.category.errorMessage.value"
          clearable
          label="カテゴリ名"
          placeholder="カテゴリ名を入力してください"
        />
      </div>
      <ManageContentFormActions
        :content-id="shopCategoryData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>

<style lang="scss" scoped>
.shop-detail-form {
  width: 60dvw;
  min-width: 300px;
  max-width: 840px;

  @media only screen and (max-width: $grid-breakpoint-sm) {
    width: 75dvw;
  }
}
</style>
