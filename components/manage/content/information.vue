<script setup lang="ts">
import type {
  InformationType,
  InformationForm,
  ContentEditMode,
} from '@/types/content'
import { getInformationKind } from '@/composables/use-content/use-information'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    informationData?: InformationType | null
  }>(),
  {
    informationData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: InformationForm]
  update: [{ id: string; formData: InformationForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getInformationKind()

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
  <CommonContentDeleteConfirm
    v-if="editMode === 'delete'"
    v-model:comfirm="modal"
    :content-title="contentTitle"
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
      <div v-if="['new', 'update', 'image'].includes(editMode)" class="mt-3">
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
      <template v-if="['new', 'update', 'image', 'title'].includes(editMode)">
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
      </template>
      <div v-if="['new', 'update', 'body'].includes(editMode)" class="mt-3">
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
        :content-id="informationData?.id"
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
