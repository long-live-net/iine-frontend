<script setup lang="ts">
import type { InformationType, InformationForm } from '@/types/content'
import { getInformationKind } from '@/composables/use-content/use-information'

const props = defineProps<{
  informationData?: InformationType | null
  activaterLabel?: string
}>()
const emit = defineEmits<{
  create: [inputData: InformationForm]
  update: [{ id: number; formData: InformationForm }]
  remove: [id: number]
}>()

const { customerId } = useFoundation()
const apiKind = getInformationKind()

const modal = ref(false)
const { handleSubmit, handleReset, formData, resetInformationForm } =
  useInformationForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetInformationForm(props.informationData)
  }
})

const onCreate = handleSubmit((informationForm) => {
  emit('create', informationForm)
  modal.value = false
})

const onUpdate = handleSubmit((informationForm) => {
  if (!props.informationData?.id) {
    return
  }
  emit('update', {
    id: props.informationData.id,
    formData: informationForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.informationData?.id) {
    return
  }
  emit('remove', props.informationData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditActivator
    v-model:modal="modal"
    :is-update="!!informationData?.id"
    :activater-label="activaterLabel"
  />
  <CommonContentEditDialog
    v-model:modal="modal"
    :is-update="!!informationData?.id"
  >
    <v-form>
      <div>
        <CommonContentFileInput
          v-model="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="タイトル画像"
          :customer-id="customerId"
          :api-kind="apiKind"
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
        <v-text-field
          v-model="formData.subtitle.value.value"
          :error-messages="formData.subtitle.errorMessage.value"
          clearable
          label="サブタイトル"
          placeholder="サブタイトルを入力してください"
        />
      </div>
      <div class="mt-3">
        <CommonWysiwsgEditor
          v-model="formData.body.value.value"
          :error-messages="formData.body.errorMessage.value"
          clearable
          label="本文"
          placeholder="本文を入力してください"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <ManageContentFormActions
        :content-id="informationData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
