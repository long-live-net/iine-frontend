<script setup lang="ts">
import type { GlobalComponents } from '@vue/runtime-core'
import type { EyecatchType, EyecatchForm } from '@/types/content'
import type { BaseFileInputType } from '@/components/base/base-types'

const props = defineProps<{
  eyecatchData?: EyecatchType | null
}>()

const emit = defineEmits<{
  create: [inputData: EyecatchForm]
  update: [inputData: EyecatchForm]
}>()

const { noBlank, maxLength } = useValidateRules()
const eyecatcherForm = reactive<EyecatchForm>({
  title: '',
  subtitle: '',
  image: '',
  imageFile: null,
})
const eyecatcherFormRule = {
  title: [
    (v: string) => noBlank(v) || 'トップタイトルを入力してください',
    (v: string) => maxLength(v, 40) || '40文字以内で入力してください',
  ],
  subtitle: [(v: string) => maxLength(v, 50) || '50文字以内で入力してください'],
  image: [
    (v: string) => noBlank(v) || 'トップ背景画像ファイルを設定してください',
  ],
}
const modal = ref(false)
const contentFormComponent = ref<GlobalComponents['VForm'] | null>(null)
const fileInputComponent = ref<BaseFileInputType | null>(null)

const resetEyeCatcherForm = () => {
  eyecatcherForm.title = props.eyecatchData?.title ?? ''
  eyecatcherForm.subtitle = props.eyecatchData?.subtitle ?? ''
  eyecatcherForm.image = props.eyecatchData?.image?.url ?? ''
  eyecatcherForm.imageFile = null
}
watch(
  () => props.eyecatchData,
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
  eyecatcherForm.image = params.url
  eyecatcherForm.imageFile = params.file
}

const onCreate = async () => {
  contentFormComponent.value?.validate()
  fileInputComponent.value?.validate()
  if (
    contentFormComponent.value?.isValid &&
    fileInputComponent.value?.isValid
  ) {
    emit('create', eyecatcherForm)
    modal.value = false
  }
}

const onUpdate = async () => {
  contentFormComponent.value?.validate()
  fileInputComponent.value?.validate()
  if (
    props.eyecatchData?.id !== null &&
    props.eyecatchData?.id !== undefined &&
    contentFormComponent.value?.isValid &&
    fileInputComponent.value?.isValid
  ) {
    emit('update', eyecatcherForm)
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
    :content="eyecatchData"
  />
  <GuiContentFormDialog v-model:modal="modal">
    <template #header>
      <p class="mr-1">
        <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
      </p>
      <h3 v-if="eyecatchData?.id">コンテンツの更新</h3>
      <h3 v-else="eyecatchData?.id">コンテンツの登録</h3>
    </template>
    <template #default>
      <v-form ref="contentFormComponent">
        <div>
          <label for="eyecatcher-form-input-image">トップ背景画像</label>
          <BaseFileInput
            id="eyecatcher-form-input-image"
            ref="fileInputComponent"
            :image-url="eyecatcherForm.image"
            :rules="eyecatcherFormRule.image"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-4">
          <label for="eyecatcher-form-input-title">トップタイトル</label>
          <v-text-field
            v-model="eyecatcherForm.title"
            :rules="eyecatcherFormRule.title"
            clearable
            placeholder="トップタイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="eyecatcher-form-input-subtitle">サブタイトル</label>
          <v-text-field
            v-model="eyecatcherForm.subtitle"
            :rules="eyecatcherFormRule.subtitle"
            clearable
            placeholder="サブタイトルを入力してください"
          />
        </div>
        <div class="mt-4 mb-2 text-right">
          <v-btn
            v-if="eyecatchData?.id"
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
