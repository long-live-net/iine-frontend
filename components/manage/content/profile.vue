<script setup lang="ts">
import type { ProfileType, ProfileForm, ContentEditMode } from '@/types/content'
import { getProfileKind } from '@/composables/use-content/use-profile'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    profileData?: ProfileType | null
  }>(),
  {
    profileData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: ProfileForm]
  update: [{ id: string; formData: ProfileForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getProfileKind()

const { handleSubmit, handleReset, formData, resetProfileForm } =
  useProfileForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetProfileForm(props.profileData)
  }
})

const onCreate = handleSubmit((profileForm) => {
  emit('create', profileForm)
  modal.value = false
})

const onUpdate = handleSubmit((profileForm) => {
  if (!props.profileData?.id) {
    return
  }
  emit('update', {
    id: props.profileData.id,
    formData: profileForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.profileData?.id) {
    return
  }
  emit('remove', props.profileData.id)
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
      <div
        v-if="['new', 'update', 'captionBody'].includes(editMode)"
        class="mt-3"
      >
        <CommonWysiwygEditor
          v-model="formData.captionBody.value.value"
          :error-messages="formData.captionBody.errorMessage.value"
          clearable
          label="説明"
          placeholder="説明を入力してください"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <div v-if="['update', 'body'].includes(editMode)" class="mt-3">
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
        :content-id="profileData?.id"
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
