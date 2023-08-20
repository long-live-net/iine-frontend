<script setup lang="ts">
import type { ContactType, ContactForm } from '@/types/content'

const props = defineProps<{
  contactData?: ContactType | null
  activaterLabel?: string
}>()

const emit = defineEmits<{
  create: [inputData: ContactForm]
  update: [{ id: number; formData: ContactForm }]
  remove: [id: number]
}>()

const modal = ref(false)
const { handleSubmit, handleReset, formData, resetContactForm } =
  useContactForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetContactForm(props.contactData)
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  formData.image.value.value = params.url
  formData.imageFile.value.value = params.file
}

const onCreate = handleSubmit((contanctForm) => {
  console.log('contanctForm', contanctForm)
  emit('create', contanctForm)
  modal.value = false
})

const onUpdate = handleSubmit((contanctForm) => {
  console.log('contact id', props.contactData?.id)
  console.log('contanctForm', contanctForm)
  if (props.contactData?.id) {
    emit('update', {
      id: props.contactData.id,
      formData: contanctForm,
    })
  }
  modal.value = false
})

const onRemove = () => {
  console.log('contact id', props.contactData?.id)
  if (props.contactData?.id) {
    if (process.client) {
      const confirmed = window.confirm('本当に削除してもよろしいですか？')
      if (confirmed) {
        emit('remove', props.contactData.id)
      }
    }
  }
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <GuiContentFormDialogActivator
    v-model:modal="modal"
    :is-update="!!contactData?.id"
    :activaterLabel="activaterLabel"
  />
  <GuiContentFormDialog v-model:modal="modal" :is-update="!!contactData?.id">
    <v-form>
      <div>
        <BaseFileInput
          :image-url="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="タイトル画像"
          @change-image-file="onChangeImageFile"
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
        <BaseWysiwsgEditor
          v-model="formData.body.value.value"
          :error-messages="formData.body.errorMessage.value"
          clearable
          label="本文"
          placeholder="本文を入力してください"
        />
      </div>
      <div class="mt-4 mb-2 d-flex justify-space-between">
        <div>
          <v-btn
            v-if="contactData?.id"
            prepend-icon="mdi-delete"
            color="error"
            variant="outlined"
            width="8rem"
            @click="onRemove"
          >
            削除する
          </v-btn>
        </div>
        <div>
          <v-btn
            v-if="contactData?.id"
            prepend-icon="mdi-content-save"
            color="success"
            variant="flat"
            width="8rem"
            @click="onUpdate"
          >
            更新する
          </v-btn>
          <v-btn
            v-else
            prepend-icon="mdi-content-save"
            color="info"
            variant="flat"
            width="8rem"
            @click="onCreate"
          >
            作成する
          </v-btn>
          <v-btn
            prepend-icon="mdi-cancel"
            color="grey-lighten-2"
            variant="flat"
            width="8rem"
            class="ml-1"
            @click="onCancel"
          >
            キャンセル
          </v-btn>
        </div>
      </div>
    </v-form>
  </GuiContentFormDialog>
</template>
