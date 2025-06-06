<script setup lang="ts">
import type {
  EyecatchType,
  EyecatchForm,
  ContentEditMode,
} from '@/types/content'
import { getEyecatchKind } from '@/composables/use-content/use-eyecatch'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    eyecatchData?: EyecatchType | null
    editMode: ContentEditMode
    contentTitle: string
  }>(),
  {
    eyecatchData: null,
  }
)

const emit = defineEmits<{
  create: [inputData: EyecatchForm]
  update: [{ id: string; formData: EyecatchForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getEyecatchKind()

const { handleSubmit, handleReset, formData, resetEyeCatchForm } =
  useEyecatchForm()

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
          :label="contentTitle"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <div
        v-if="['new', 'update', 'image', 'title'].includes(editMode)"
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
      <div
        v-if="['new', 'update', 'image', 'title'].includes(editMode)"
        class="mt-3"
      >
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
