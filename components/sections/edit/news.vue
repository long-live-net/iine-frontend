<script setup lang="ts">
import type { GlobalComponents } from '@vue/runtime-core'
import type { NewsType, NewsForm } from '@/types/content'
import type {
  BaseFileInputType,
  BaseWysiwsgEditorType,
} from '@/components/base/base-types'
import { newsCategory2Label } from '@/composables/use-news-category'

const props = defineProps<{
  newsData?: NewsType | null
}>()

const emit = defineEmits<{
  create: [inputData: NewsForm]
  update: [inputData: NewsForm]
}>()

const { required, noBlank, maxLength } = useValidateRules()
const newsForm = reactive<NewsForm>({
  title: '',
  category: null,
  publishOn: null,
  body: '',
  image: '',
  imageFile: null,
})
const newsFormRule = {
  title: [
    (v: string) => noBlank(v) || 'タイトルを入力してください',
    (v: string) => maxLength(v, 40) || '40文字以内で入力してください',
  ],
  category: [(v: string) => required(v) || 'カテゴリを入力してください'],
  publishOn: [(v: string) => required(v) || '公開日を入力してください'],
  body: [
    (v: string) => noBlank(v) || '本文を入力してください',
    (v: string) => maxLength(v, 1000) || '1000文字以内で入力してください',
  ],
}
const modal = ref(false)
const contentFormComponent = ref<GlobalComponents['VForm'] | null>(null)
const fileInputComponent = ref<BaseFileInputType | null>(null)
const wysiwygEditorComponent = ref<BaseWysiwsgEditorType | null>(null)

const categoryChoices = Object.entries(newsCategory2Label).map(
  ([key, value]) => ({
    value: key,
    title: value,
  })
)

const resetNewsForm = () => {
  newsForm.title = props.newsData?.title ?? ''
  newsForm.category = props.newsData?.category ?? null
  newsForm.publishOn = props.newsData?.publishOn ?? null
  newsForm.body = props.newsData?.body ?? ''
  newsForm.image = props.newsData?.image?.url ?? ''
  newsForm.imageFile = null
}
watch(
  () => props.newsData,
  () => {
    resetNewsForm()
  },
  { immediate: true }
)
watch(modal, (current) => {
  if (current) {
    resetNewsForm()
    contentFormComponent.value?.reset()
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  newsForm.image = params.url
  newsForm.imageFile = params.file
}

const validate = () => {
  contentFormComponent.value?.validate()
  fileInputComponent.value?.validate()
  wysiwygEditorComponent.value?.validate()
}
const isValid = computed(
  () =>
    contentFormComponent.value?.isValid &&
    fileInputComponent.value?.isValid &&
    wysiwygEditorComponent.value?.isValid
)

const onCreate = async () => {
  validate()
  if (isValid.value) {
    emit('create', newsForm)
    modal.value = false
  }
}
const onUpdate = async () => {
  validate()
  if (isValid.value) {
    emit('update', newsForm)
    modal.value = false
  }
}
const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator v-model:modal="modal" :content="newsData" />
  <GuiContentFormDialog v-model:modal="modal">
    <template #header>
      <p class="mr-1">
        <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
      </p>
      <h3 v-if="newsData?.id">コンテンツの更新</h3>
      <h3 v-else="newsData?.id">コンテンツの登録</h3>
    </template>
    <template #default>
      <v-form ref="contentFormComponent" class="news-form">
        <div>
          <BaseFileInput
            ref="fileInputComponent"
            :image-url="newsForm.image"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-4">
          <v-text-field
            id="news-form-input-title"
            v-model="newsForm.title"
            :rules="newsFormRule.title"
            clearable
            label="タイトル"
            placeholder="タイトルを入力してください"
          />
        </div>
        <div class="row-wrapper mt-4">
          <div class="row-field">
            <v-select
              v-model="newsForm.category"
              :items="categoryChoices"
              :rules="newsFormRule.category"
              label="カテゴリ"
            />
          </div>
          <div class="row-field">
            <BaseDatePicker
              v-model="newsForm.publishOn"
              :rules="newsFormRule.publishOn"
              label="公開日"
              placeholder="公開日を選択してください"
              pickerTitle="公開日を選択してください"
            />
          </div>
        </div>
        <div class="mt-4">
          <BaseWysiwsgEditor
            ref="wysiwygEditorComponent"
            v-model="newsForm.body"
            :rules="newsFormRule.body"
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
            作成する
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
    </template>
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
