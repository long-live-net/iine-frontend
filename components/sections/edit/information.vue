<script setup lang="ts">
import type { GlobalComponents } from '@vue/runtime-core'
import type { InformationType, InformationForm } from '@/types/content'
import type {
  BaseFileInputType,
  BaseWysiwsgEditorType,
} from '@/components/base/base-types'

const props = defineProps<{
  informationData?: InformationType | null
}>()

const emit = defineEmits<{
  create: [inputData: InformationForm]
  update: [inputData: InformationForm]
}>()

const { noBlank, maxLength } = useValidateRules()
const informationerForm = reactive<InformationForm>({
  title: '',
  subtitle: '',
  body: '',
  image: '',
  imageFile: null,
})
const informationerFormRule = {
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
  informationerForm.title = props.informationData?.title ?? ''
  informationerForm.subtitle = props.informationData?.subtitle ?? ''
  informationerForm.body = props.informationData?.body ?? ''
  informationerForm.image = props.informationData?.image?.url ?? ''
  informationerForm.imageFile = null
}
watch(
  () => props.informationData,
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
  informationerForm.image = params.url
  informationerForm.imageFile = params.file
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
    emit('create', informationerForm)
    modal.value = false
  }
}

const onUpdate = async () => {
  validate()
  if (isValid.value) {
    emit('update', informationerForm)
    modal.value = false
  }
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator
    v-model:modal="modal"
    :content="informationData"
  />
  <GuiContentFormDialog v-model:modal="modal">
    <template #header>
      <p class="mr-1">
        <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
      </p>
      <h3 v-if="informationData?.id">コンテンツの更新</h3>
      <h3 v-else="informationData?.id">コンテンツの登録</h3>
    </template>
    <template #default>
      <v-form ref="contentFormComponent">
        <div>
          <label for="informationer-form-input-image">タイトル背景画像</label>
          <BaseFileInput
            id="informationer-form-input-image"
            ref="fileInputComponent"
            :image-url="informationerForm.image"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-4">
          <label for="informationer-form-input-title">タイトル</label>
          <v-text-field
            id="informationer-form-input-title"
            v-model="informationerForm.title"
            :rules="informationerFormRule.title"
            clearable
            placeholder="タイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="informationer-form-input-subtitle">サブタイトル</label>
          <v-text-field
            id="informationer-form-input-subtitle"
            v-model="informationerForm.subtitle"
            :rules="informationerFormRule.subtitle"
            clearable
            placeholder="サブタイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="informationer-form-input-body">本文</label>
          <BaseWysiwsgEditor
            id="informationer-form-input-body"
            ref="wysiwygEditorComponent"
            v-model="informationerForm.body"
            :rules="informationerFormRule.body"
            placeholder="本文を入力してください"
          />
        </div>
        <div class="mt-4 mb-2 text-right">
          <v-btn
            v-if="informationData?.id"
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
