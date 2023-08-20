<script setup lang="ts">
import type { NewsType, NewsForm } from '@/types/content'
import { newsCategory2Label } from '@/composables/use-news-category'

const props = defineProps<{
  newsData?: NewsType | null
  activaterLabel?: string
}>()
const emit = defineEmits<{
  create: [inputData: NewsForm]
  update: [inputData: NewsForm]
}>()

const modal = ref(false)
const { handleSubmit, handleReset, validate, formData, resetNewsForm } =
  useNewsForm()

const categoryChoices = Object.entries(newsCategory2Label).map(
  ([key, value]) => ({
    value: key,
    title: value,
  })
)

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetNewsForm(props.newsData)
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  formData.image.value.value = params.url
  formData.imageFile.value.value = params.file
}

const onCreate = handleSubmit((newsForm) => {
  console.log('newsForm', newsForm)
  emit('create', newsForm)
  modal.value = false
})

const onUpdate = handleSubmit((newsForm) => {
  console.log('newsForm', newsForm)
  emit('update', newsForm)
  modal.value = false
})

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator
    v-model:modal="modal"
    :is-update="!!newsData?.id"
    :activaterLabel="activaterLabel"
  />
  <GuiContentFormDialog v-model:modal="modal" :is-update="!!newsData?.id">
    <v-form class="news-form">
      <div>
        <BaseFileInput
          :image-url="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="タイトル画像"
          @change-image-file="onChangeImageFile"
        />
      </div>
      <div class="mt-3">
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          label="タイトル"
          placeholder="タイトルを入力してください"
        />
      </div>
      <div class="row-wrapper mt-3">
        <div class="row-field">
          <v-select
            v-model="formData.category.value.value"
            :error-messages="formData.category.errorMessage.value"
            :items="categoryChoices"
            label="カテゴリ"
          />
        </div>
        <div class="row-field">
          <BaseDatePicker
            v-model="formData.publishOn.value.value"
            :error-messages="formData.publishOn.errorMessage.value"
            label="公開日"
            placeholder="公開日を選択してください"
            pickerTitle="公開日を選択してください"
          />
        </div>
      </div>
      <div class="mt-3">
        <BaseWysiwsgEditor
          v-model="formData.body.value.value"
          :error-messages="formData.body.errorMessage.value"
          clearable
          label="本文"
          placeholder="本文を入力してください"
        />
      </div>
      <div class="mt-2 mb-2 text-right">
        <v-btn
          v-if="newsData?.id"
          prepend-icon="mdi-content-save"
          color="success"
          variant="flat"
          width="8rem"
          @click="onUpdate"
        >
          更新する
        </v-btn>
        <v-btn
          v-else
          prepend-icon="mdi-content-save"
          color="info"
          variant="flat"
          width="8rem"
          @click="onCreate"
        >
          登録する
        </v-btn>
        <v-btn
          prepend-icon="mdi-cancel"
          color="grey-lighten-2"
          variant="flat"
          width="8rem"
          class="ml-1"
          @click="onCancel"
        >
          キャンセル
        </v-btn>
      </div>
    </v-form>
  </GuiContentFormDialog>
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
