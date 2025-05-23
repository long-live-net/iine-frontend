<script setup lang="ts">
import type {
  NewsCategoryType,
  NewsCategoryForm,
  ContentEditMode,
  NewsCategory,
} from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    newsCategoryData?: NewsCategoryType | null
  }>(),
  {
    newsCategoryData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: NewsCategoryForm]
  update: [{ id: string; formData: NewsCategoryForm }]
  remove: [id: string]
}>()

const { handleSubmit, handleReset, formData, resetNewsCategoryForm } =
  useNewsCategoryForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetNewsCategoryForm(props.newsCategoryData)
  }
})

const onCreate = handleSubmit((NewsCategoryForm) => {
  emit('create', NewsCategoryForm)
  modal.value = false
})

const onUpdate = handleSubmit((NewsCategoryForm) => {
  if (!props.newsCategoryData?.id) {
    return
  }
  emit('update', {
    id: props.newsCategoryData?.id,
    formData: NewsCategoryForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.newsCategoryData?.id) {
    return
  }
  emit('remove', props.newsCategoryData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}

const sampleCategory = computed<NewsCategory>(() => ({
  name: formData.category.value.value || 'カテゴリ名',
  color: formData.color.value.value || 'white',
}))
</script>

<template>
  <CommonContentDeleteConfirm
    v-if="editMode === 'delete'"
    v-model:comfirm="modal"
    :content-title="contentTitle"
    @cancel="modal = false"
    @confirm="onRemove"
  />
  <CommonContentAlertConfirm
    v-else-if="editMode === 'maximumLimit'"
    v-model:comfirm="modal"
    title="これ以上登録できません"
    message="news カテゴリの登録上限数に達しています。"
    @confirm="modal = false"
  />
  <CommonContentEditDialog
    v-else
    v-model:modal="modal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :persistent="false"
  >
    <v-form class="news-detail-form">
      <div class="mt-6">
        <v-text-field
          v-model="formData.category.value.value"
          :error-messages="formData.category.errorMessage.value"
          label="カテゴリ名"
          placeholder="カテゴリ名を入力してください"
          clearable
          counter
        />
      </div>
      <div class="category-color">
        <div>
          <p class="color-selection-label"><small>背景色選択</small></p>
          <BaseColorPickerMenu
            v-model:color="formData.color.value.value"
            activator-label="サンプル"
            use-light-swatches
          >
            <template #activator="{ props: menuProps }">
              <div
                v-ripple
                class="color-picker"
                v-bind="menuProps"
                :style="{
                  'background-color': sampleCategory.color,
                }"
              />
            </template>
          </BaseColorPickerMenu>
          <p v-if="formData.color.errorMessage.value">
            <small style="color: red">{{
              formData.color.errorMessage.value
            }}</small>
          </p>
        </div>
        <div>
          <p class="sample-label"><small>サンプル</small></p>
          <PublishNewsCategoryBadge
            :category="sampleCategory"
            style="padding: 2px 0"
          />
        </div>
      </div>
      <ManageContentFormActions
        :content-id="newsCategoryData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>

<style lang="scss" scoped>
.news-detail-form {
  width: 380px;
  max-width: 98%;

  .category-color {
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    padding: 0 16px;
    display: flex;
    column-gap: 52px;

    .color-selection-label {
      margin-bottom: 8px;
    }

    .color-picker {
      border: 1px solid #999;
      border-radius: 50%;
      cursor: pointer;
      width: 38px;
      height: 38px;
      margin-left: 13px;
    }

    .sample-label {
      margin-bottom: 12px;
    }

    div {
      width: fit-content;
    }
  }
}
</style>
