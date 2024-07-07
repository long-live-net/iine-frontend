<script setup lang="ts">
import type { EyecatchType, EyecatchForm } from '@/types/content'

const props = defineProps<{
  eyecatchData?: EyecatchType | null
  activaterLabel?: string
}>()

const emit = defineEmits<{
  create: [inputData: EyecatchForm]
  update: [{ id: number; formData: EyecatchForm }]
  remove: [id: number]
}>()

const modal = ref(false)
const {
  handleSubmit,
  handleReset,
  formData,
  resetEyeCatchForm,
  changeImageFile,
} = useEyecatchForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetEyeCatchForm(props.eyecatchData)
  }
})

const onCreate = handleSubmit((eyecatchForm) => {
  emit('create', eyecatchForm)
  modal.value = false
})

const onUpdate = handleSubmit((eyecatchForm) => {
  if (!props.eyecatchData?.id) {
    return
  }
  emit('update', {
    id: props.eyecatchData.id,
    formData: eyecatchForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.eyecatchData?.id) {
    return
  }
  emit('remove', props.eyecatchData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditActivator
    v-model:modal="modal"
    :is-update="!!eyecatchData?.id"
    :activater-label="activaterLabel"
  />
  <CommonContentEditDialog
    v-model:modal="modal"
    :is-update="!!eyecatchData?.id"
  >
    <v-form>
      <div>
        <BaseFileInput
          :image-url="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="トップ画像"
          @change-image-file="changeImageFile"
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
      <ManageContentFormActions
        :content-id="eyecatchData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
