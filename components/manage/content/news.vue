<script setup lang="ts">
import type { NewsType, NewsForm, ContentEditMode } from '@/types/content'
import { getNewsKind } from '@/composables/use-content/use-news'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    newsData?: NewsType | null
  }>(),
  {
    newsData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: NewsForm]
  update: [{ id: string; formData: NewsForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getNewsKind()

const { handleSubmit, handleReset, formData, resetNewsForm } = useNewsForm()
const { categoryItems } = useNewsCategory()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetNewsForm(props.newsData)
  }
})

const onCreate = handleSubmit((newsForm) => {
  emit('create', newsForm)
  modal.value = false
})

const onUpdate = handleSubmit((newsForm) => {
  if (!props.newsData?.id) {
    return
  }
  emit('update', {
    id: props.newsData?.id,
    formData: newsForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.newsData?.id) {
    return
  }
  emit('remove', props.newsData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditDialog
    v-model:modal="modal"
    :content-title="contentTitle"
    :edit-mode="editMode"
  >
    <v-form class="news-form">
      <div
        v-if="['new', 'update', 'image', 'caption'].includes(editMode)"
        class="mt-3"
      >
        <CommonContentInputImage
          v-model:url="formData.image.value.value"
          v-model:name="formData.imageName.value.value"
          v-model:type="formData.imageType.value.value"
          v-model:settings="formData.imageSettings.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="タイトル画像"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <div
        v-if="['new', 'update', 'image', 'title', 'caption'].includes(editMode)"
        class="mt-3"
      >
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          label="タイトル"
          placeholder="タイトルを入力してください"
        />
      </div>
      <template v-if="['new', 'update', 'body', 'caption'].includes(editMode)">
        <div class="row-wrapper mt-3">
          <div class="row-field">
            <v-select
              v-model="formData.category.value.value"
              :error-messages="formData.category.errorMessage.value"
              :items="categoryItems"
              label="カテゴリ"
            />
          </div>
          <div class="row-field">
            <BaseDatePicker
              v-model="formData.publishOn.value.value"
              :error-messages="formData.publishOn.errorMessage.value"
              label="公開日"
              placeholder="公開日を選択してください"
              picker-title="公開日を選択してください"
            />
          </div>
        </div>
        <div v-if="['new', 'update', 'body'].includes(editMode)" class="mt-3">
          <CommonWysiwygEditor
            v-model="formData.body.value.value"
            :error-messages="formData.body.errorMessage.value"
            clearable
            label="本文"
            placeholder="本文を入力してください"
            :customer-id="customerId"
            :api-kind="apiKind"
          />
        </div>
      </template>
      <ManageContentFormActions
        :content-id="newsData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>

<style scoped lang="scss">
.news-form {
  .row-wrapper {
    display: flex;
    flex-flow: row nowrap;
    column-gap: 1rem;
    .row-field {
      width: calc(50% - 0.5rem);
    }
  }
}
@media only screen and (max-width: $grid-breakpoint-sm) {
  .news-form {
    .row-wrapper {
      flex-flow: column;
      align-items: stretch;
      column-gap: normal;
      .row-field {
        width: auto;
      }
    }
  }
}
</style>
