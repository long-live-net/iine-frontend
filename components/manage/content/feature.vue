<script setup lang="ts">
import type { FeatureType, FeatureForm, ContentEditMode } from '@/types/content'
import { getFeatureKind } from '@/composables/use-content/use-features'
import { useFeatureForm } from '~/composables/use-content/use-feature-form'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    featureData?: FeatureType | null
  }>(),
  {
    featureData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: FeatureForm]
  update: [{ id: string; formData: FeatureForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getFeatureKind()

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
  <BaseConfirm
    v-if="editMode === 'delete'"
    v-model:comfirm="modal"
    message="本当に削除しますか？"
    exec-text="削除する"
    @cancel="modal = false"
    @confirm="onRemove"
  />
  <CommonContentEditDialog
    v-else
    v-model:modal="modal"
    :content-title="contentTitle"
    :edit-mode="editMode"
  >
    <v-form class="content-form">
      <div
        v-if="['new', 'update', 'image', 'caption'].includes(editMode)"
        class="mt-3"
      >
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
      <div
        v-if="['new', 'update', 'image', 'title', 'caption'].includes(editMode)"
        class="mt-3"
      >
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          label="タイトル"
          placeholder="タイトルを入力してください"
        />
      </div>
      <div v-if="['new', 'update', 'caption'].includes(editMode)" class="mt-3">
        <CommonWysiwygEditor
          v-model="formData.caption.value.value"
          :error-messages="formData.caption.errorMessage.value"
          clearable
          label="概要"
          placeholder="概要を入力してください"
          simple-text
          no-image
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <div v-if="['body'].includes(editMode)" class="mt-3">
        <CommonWysiwygEditor
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
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>

<style lang="scss" scoped>
.content-form {
  width: 60dvw;
  min-width: 300px;
  max-width: 840px;

  @media only screen and (max-width: $grid-breakpoint-sm) {
    width: 75dvw;
  }
}
</style>
