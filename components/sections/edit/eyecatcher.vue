<script setup lang="ts">
import type { EyecatchType, EyecatchForm } from '@/types/content'
import { useEyecatchForm } from '~/composables/use-content-eyecatch'

const props = defineProps<{
  eyecatchData?: EyecatchType | null
}>()

const emit = defineEmits<{
  create: [inputData: EyecatchForm]
  update: [inputData: EyecatchForm]
}>()

const modal = ref(false)
const { handleSubmit, handleReset, formData, resetEyeCatchForm } =
  useEyecatchForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetEyeCatchForm(props.eyecatchData)
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  formData.image.value.value = params.url
  formData.imageFile.value.value = params.file
}

const onCreate = handleSubmit((eyecatcherForm) => {
  console.log('eyecatcherForm', eyecatcherForm)
  emit('create', eyecatcherForm)
  modal.value = false
})

const onUpdate = handleSubmit((eyecatcherForm) => {
  console.log('eyecatcherForm', eyecatcherForm)
  emit('update', eyecatcherForm)
  modal.value = false
})

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
      <v-form>
        <div>
          <BaseFileInput
            :image-url="formData.image.value.value"
            :error-messages="formData.image.errorMessage.value"
            label="トップ画像"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-3">
          <v-text-field
            v-model="formData.title.value.value"
            :error-messages="formData.title.errorMessage.value"
            clearable
            label="トップタイトル"
            placeholder="トップタイトルを入力してください"
          />
        </div>
        <div class="mt-3">
          <v-text-field
            v-model="formData.subtitle.value.value"
            :error-messages="formData.subtitle.errorMessage.value"
            clearable
            label="サブタイトル"
            placeholder="サブタイトルを入力してください"
          />
        </div>
        <div class="mt-2 mb-2 text-right">
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
