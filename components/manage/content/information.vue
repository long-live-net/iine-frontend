<script setup lang="ts">
import type { InformationType, InformationForm } from '@/types/content'
import { getInformationKind } from '@/composables/use-content/use-information'

const props = defineProps<{
  informationData?: InformationType | null
  activatorLabel?: string
}>()
const emit = defineEmits<{
  create: [inputData: InformationForm]
  update: [{ id: string; formData: InformationForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
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
    :activator-label="activatorLabel"
  />
  <CommonContentEditDialog
    v-model:modal="modal"
    :is-update="!!informationData?.id"
  >
    <v-form>
      <div>
        <CommonContentInputImage
          v-model:url="formData.image.value.value"
          v-model:name="formData.imageName.value.value"
          v-model:type="formData.imageType.value.value"
          v-model:settings="formData.imageSettings.value.value"
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
