<script setup lang="ts">
import type { ServiceType, ServiceForm, ContentEditMode } from '@/types/content'
import { getServiceKind } from '@/composables/use-content/use-service'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    serviceData?: ServiceType | null
  }>(),
  {
    serviceData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: ServiceForm]
  update: [{ id: string; formData: ServiceForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getServiceKind()

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
  <CommonContentDeleteConfirm
    v-if="editMode === 'delete'"
    v-model:comfirm="modal"
    :content-title="contentTitle"
    @cancel="modal = false"
    @confirm="onRemove"
  />
  <CommonContentAlertConfirm
    v-else-if="editMode === 'maximumLimit'"
    v-model:comfirm="modal"
    title="これ以上登録できません"
    :message="`${contentTitle}の登録上限数に達しています。`"
    @confirm="modal = false"
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
        :content-id="serviceData?.id"
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
