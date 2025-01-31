<script setup lang="ts">
import type { ServiceType, ServiceForm } from '@/types/content'
import { getServiceKind } from '@/composables/use-content/use-service'

const props = defineProps<{
  serviceData?: ServiceType | null
  activatorLabel?: string
  activatorSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()
const emit = defineEmits<{
  create: [inputData: ServiceForm]
  update: [{ id: string; formData: ServiceForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getServiceKind()

const modal = ref(false)
const { handleSubmit, handleReset, formData, resetServiceForm } =
  useServiceForm()

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
  <CommonContentEditActivator
    v-model:modal="modal"
    :is-update="!!serviceData?.id"
    :activator-label="activatorLabel"
    :activator-size="activatorSize"
  />
  <CommonContentEditDialog v-model:modal="modal" :is-update="!!serviceData?.id">
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
        :content-id="serviceData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
