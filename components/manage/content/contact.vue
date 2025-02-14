<script setup lang="ts">
import type { ContactType, ContactForm } from '@/types/content'
import { getContactKind } from '@/composables/use-content/use-contact'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{
  itemData?: ContactType | null
  activatorLabel?: string
}>()

const emit = defineEmits<{
  create: [inputData: ContactForm]
  update: [{ id: string; formData: ContactForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getContactKind()

const { handleSubmit, handleReset, formData, resetContactForm } =
  useContactForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetContactForm(props.itemData)
  }
})

const onCreate = handleSubmit((contanctForm) => {
  emit('create', contanctForm)
  modal.value = false
})

const onUpdate = handleSubmit((contanctForm) => {
  if (!props.itemData?.id) {
    return
  }
  emit('update', {
    id: props.itemData.id,
    formData: contanctForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.itemData?.id) {
    return
  }
  emit('remove', props.itemData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditDialog v-model:modal="modal" :is-update="!!itemData?.id">
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
      <div class="mt-4">
        <v-text-field
          v-model="formData.subtitle.value.value"
          :error-messages="formData.subtitle.errorMessage.value"
          clearable
          label="サブタイトル"
          placeholder="サブタイトルを入力してください"
        />
      </div>
      <div class="mt-4">
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
        :content-id="itemData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
