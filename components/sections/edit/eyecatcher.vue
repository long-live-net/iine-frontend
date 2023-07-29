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

const resetEyeCatcherForm = () => {
  eyecatcherForm.title = eyecatchData.title
  eyecatcherForm.subtitle = eyecatchData.subtitle ?? ''
  eyecatcherForm.image = eyecatchData.image.url
  eyecatcherForm.imageFile = null
}

const modal = ref(false)
const contentFormComponent = ref<GlobalComponents['VForm'] | null>(null)
const fileInputComponent = ref<typeof GuiBaseFileInput | null>(null)

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

const { compressing, compress } = useImageCompression()
const onChangeImageFile = async (imageFile: File) => {
  const { compressedImageFile, compressedImageUrl } = await compress(imageFile)
  eyecatcherForm.imageFile = compressedImageFile
  eyecatcherForm.image = compressedImageUrl
}

const onSubmit = () => {
  contentFormComponent.value?.validate()
  fileInputComponent.value?.validate()
  if (
    contentFormComponent.value?.isValid &&
    fileInputComponent.value?.isImageValid
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
            ref="fileInputComponent"
            id="eyecatcher-form-input-image"
            :image-url="eyecatcherForm.image"
            :rules="eyecatcherFormRule.image"
            :buzy="compressing"
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
