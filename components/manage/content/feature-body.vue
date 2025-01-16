<script setup lang="ts">
import type { FeatureType, FeatureForm } from '@/types/content'
import { getFeatureKind } from '@/composables/use-content/use-features'
import { useFeatureForm } from '~/composables/use-content/use-feature-form'

const props = defineProps<{
  featureData?: FeatureType | null
  activatorLabel?: string
  activatorSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()
const emit = defineEmits<{
  create: [inputData: FeatureForm]
  update: [{ id: number; formData: FeatureForm }]
  remove: [id: number]
}>()

const { customerId } = useCustomer()
const apiKind = getFeatureKind()

const modal = ref(false)
const { handleSubmit, handleReset, formData, resetFeatureForm } =
  useFeatureForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetFeatureForm(props.featureData)
  }
})

const onCreate = handleSubmit((featureForm) => {
  emit('create', featureForm)
  modal.value = false
})

const onUpdate = handleSubmit((featureForm) => {
  if (!props.featureData?.id) {
    return
  }
  emit('update', {
    id: props.featureData?.id,
    formData: featureForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.featureData?.id) {
    return
  }
  emit('remove', props.featureData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditActivator
    v-model:modal="modal"
    :is-update="!!featureData?.id"
    :activator-label="activatorLabel"
    :activator-size="activatorSize"
  />
  <CommonContentEditDialog v-model:modal="modal" :is-update="!!featureData?.id">
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
        :content-id="featureData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
