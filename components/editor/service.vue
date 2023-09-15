<script setup lang="ts">
import type { ServiceType, ServiceForm } from '@/types/content'

const props = defineProps<{
  serviceData?: ServiceType | null
  activaterLabel?: string
  activaterSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()
const emit = defineEmits<{
  create: [inputData: ServiceForm]
  update: [{ id: number; formData: ServiceForm }]
  remove: [id: number]
}>()

const modal = ref(false)
const {
  handleSubmit,
  handleReset,
  formData,
  resetServiceForm,
  changeImageFile,
} = useServiceForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetServiceForm(props.serviceData)
  }
})

const onCreate = handleSubmit((serviceForm) => {
  emit('create', serviceForm)
  modal.value = false
})

const onUpdate = handleSubmit((serviceForm) => {
  if (!props.serviceData?.id) {
    return
  }
  emit('update', {
    id: props.serviceData?.id,
    formData: serviceForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.serviceData?.id) {
    return
  }
  emit('remove', props.serviceData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator
    v-model:modal="modal"
    :is-update="!!serviceData?.id"
    :activaterLabel="activaterLabel"
    :activater-size="activaterSize"
  />
  <GuiContentFormDialog v-model:modal="modal" :is-update="!!serviceData?.id">
    <v-form>
      <div>
        <BaseFileInput
          :image-url="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="タイトル画像"
          @change-image-file="changeImageFile"
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
      <div class="mt-3">
        <BaseWysiwsgEditor
          v-model="formData.caption.value.value"
          :error-messages="formData.caption.errorMessage.value"
          clearable
          label="紹介文"
          placeholder="紹介文を入力してください"
        />
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
      <EditorFormActions
        :contentId="serviceData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </GuiContentFormDialog>
</template>
