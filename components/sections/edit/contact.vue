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
const contactForm = reactive<ContactForm>({
  title: '',
  subtitle: '',
  body: '',
  image: '',
  imageFile: null,
})
const contactFormRule = {
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

const resetContactForm = () => {
  contactForm.title = props.contactData?.title ?? ''
  contactForm.subtitle = props.contactData?.subtitle ?? ''
  contactForm.body = props.contactData?.body ?? ''
  contactForm.image = props.contactData?.image?.url ?? ''
  contactForm.imageFile = null
}
watch(
  () => props.contactData,
  () => {
    resetContactForm()
  },
  { immediate: true }
)
watch(modal, (current) => {
  if (current) {
    resetContactForm()
    contentFormComponent.value?.reset()
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  contactForm.image = params.url
  contactForm.imageFile = params.file
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
    emit('create', contactForm)
    modal.value = false
  }
}
const onUpdate = async () => {
  validate()
  if (isValid.value) {
    emit('update', contactForm)
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
          <label for="contact-form-input-image">タイトル背景画像</label>
          <BaseFileInput
            id="contact-form-input-image"
            ref="fileInputComponent"
            :image-url="contactForm.image"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-8">
          <label for="contact-form-input-title">タイトル</label>
          <v-text-field
            id="contact-form-input-title"
            v-model="contactForm.title"
            :rules="contactFormRule.title"
            clearable
            placeholder="タイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="contact-form-input-subtitle">サブタイトル</label>
          <v-text-field
            id="contact-form-input-subtitle"
            v-model="contactForm.subtitle"
            :rules="contactFormRule.subtitle"
            clearable
            placeholder="サブタイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="contact-form-input-body">本文</label>
          <BaseWysiwsgEditor
            id="contact-form-input-body"
            ref="wysiwygEditorComponent"
            v-model="contactForm.body"
            :rules="contactFormRule.body"
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
