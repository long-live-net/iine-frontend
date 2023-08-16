<script setup lang="ts">
import type { GlobalComponents } from '@vue/runtime-core'
import type { ContactType, ContactForm } from '@/types/content'
import type {
  BaseFileInputType,
  BaseWysiwsgEditorType,
} from '@/components/base/base-types'

const props = defineProps<{
  contactData?: ContactType | null
}>()

const emit = defineEmits<{
  create: [inputData: ContactForm]
  update: [inputData: ContactForm]
}>()

const { noBlank, maxLength } = useValidateRules()
const contacterForm = reactive<ContactForm>({
  title: '',
  subtitle: '',
  body: '',
  image: '',
  imageFile: null,
})
const contacterFormRule = {
  title: [
    (v: string) => noBlank(v) || 'タイトルを入力してください',
    (v: string) => maxLength(v, 40) || '40文字以内で入力してください',
  ],
  subtitle: [(v: string) => maxLength(v, 50) || '50文字以内で入力してください'],
  body: [
    (v: string) => noBlank(v) || '本文を入力してください',
    (v: string) => maxLength(v, 1000) || '1000文字以内で入力してください',
  ],
}
const modal = ref(false)
const contentFormComponent = ref<GlobalComponents['VForm'] | null>(null)
const fileInputComponent = ref<BaseFileInputType | null>(null)
const wysiwygEditorComponent = ref<BaseWysiwsgEditorType | null>(null)

const resetEyeCatcherForm = () => {
  contacterForm.title = props.contactData?.title ?? ''
  contacterForm.subtitle = props.contactData?.subtitle ?? ''
  contacterForm.body = props.contactData?.body ?? ''
  contacterForm.image = props.contactData?.image?.url ?? ''
  contacterForm.imageFile = null
}
watch(
  () => props.contactData,
  () => {
    resetEyeCatcherForm()
  },
  { immediate: true }
)
watch(modal, (current) => {
  if (current) {
    resetEyeCatcherForm()
    contentFormComponent.value?.reset()
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  contacterForm.image = params.url
  contacterForm.imageFile = params.file
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
    emit('create', contacterForm)
    modal.value = false
  }
}
const onUpdate = async () => {
  validate()
  if (isValid.value) {
    emit('update', contacterForm)
    modal.value = false
  }
}
const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator v-model:modal="modal" :content="contactData" />
  <GuiContentFormDialog v-model:modal="modal">
    <template #header>
      <p class="mr-1">
        <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
      </p>
      <h3 v-if="contactData?.id">コンテンツの更新</h3>
      <h3 v-else="contactData?.id">コンテンツの登録</h3>
    </template>
    <template #default>
      <v-form ref="contentFormComponent">
        <div>
          <label for="contacter-form-input-image">タイトル背景画像</label>
          <BaseFileInput
            id="contacter-form-input-image"
            ref="fileInputComponent"
            :image-url="contacterForm.image"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-8">
          <label for="contacter-form-input-title">タイトル</label>
          <v-text-field
            id="contacter-form-input-title"
            v-model="contacterForm.title"
            :rules="contacterFormRule.title"
            clearable
            placeholder="タイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="contacter-form-input-subtitle">サブタイトル</label>
          <v-text-field
            id="contacter-form-input-subtitle"
            v-model="contacterForm.subtitle"
            :rules="contacterFormRule.subtitle"
            clearable
            placeholder="サブタイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="contacter-form-input-body">本文</label>
          <BaseWysiwsgEditor
            id="contacter-form-input-body"
            ref="wysiwygEditorComponent"
            v-model="contacterForm.body"
            :rules="contacterFormRule.body"
            clearable
            placeholder="本文を入力してください"
          />
        </div>
        <div class="mt-4 mb-2 text-right">
          <v-btn
            v-if="contactData?.id"
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
