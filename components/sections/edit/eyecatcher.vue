<script setup lang="ts">
import type { GlobalComponents } from '@vue/runtime-core'
import type { EyecatchType } from '@/types/content-types'
import GuiBaseFileInput from '@/components/gui/base/file-input.vue'

const { eyecatchData, loading = false } = defineProps<{
  contentId: number
  eyecatchData: EyecatchType
  loading: boolean
}>()

type EyecatchFormType = {
  title: string
  subtitle: string
  image: string
  imageFile: File | null
}
const eyecatcherForm = reactive<EyecatchFormType>({
  title: '',
  subtitle: '',
  image: '',
  imageFile: null,
})
const { noBlank, maxLength } = useValidateRules()
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
const fileInputComponent = ref<typeof GuiBaseFileInput | null>(null)

const resetEyeCatcherForm = () => {
  eyecatcherForm.title = eyecatchData.title
  eyecatcherForm.subtitle = eyecatchData.subtitle ?? ''
  eyecatcherForm.image = eyecatchData.image.url
  eyecatcherForm.imageFile = null
}
watch(
  () => eyecatchData,
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

const onSubmit = () => {
  contentFormComponent.value?.validate()
  fileInputComponent.value?.validate()
  if (
    contentFormComponent.value?.isValid &&
    fileInputComponent.value?.isValid
  ) {
    modal.value = false
  }
}
const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator v-model:modal="modal" />
  <GuiContentFormDialog v-model:modal="modal">
    <template #header>
      <p class="mr-1">
        <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
      </p>
      <h3>コンテンツの編集</h3>
    </template>
    <template #default>
      <v-form ref="contentFormComponent">
        <div>
          <label for="eyecatcher-form-input-image">トップ背景画像</label>
          <GuiBaseFileInput
            id="eyecatcher-form-input-image"
            ref="fileInputComponent"
            :image-url="eyecatcherForm.image"
            :rules="eyecatcherFormRule.image"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-8">
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
            prepend-icon="mdi-content-save"
            color="success"
            variant="flat"
            width="8rem"
            @click="onSubmit"
          >
            保存する
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
