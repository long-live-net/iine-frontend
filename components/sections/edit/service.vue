<script setup lang="ts">
import type { ServiceType, ServiceForm } from '@/types/content'

const props = defineProps<{
  serviceData?: ServiceType | null
  activaterLabel?: string
  activaterSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()
const emit = defineEmits<{
  create: [inputData: ServiceForm]
  update: [{ id: number; formData: ServiceForm }]
  remove: [id: number]
}>()

const modal = ref(false)
const { handleSubmit, handleReset, formData, resetServiceForm } =
  useServiceForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetServiceForm(props.serviceData)
  }
})

const onChangeImageFile = async (params: { file: File; url: string }) => {
  formData.image.value.value = params.url
  formData.imageFile.value.value = params.file
}

const onCreate = handleSubmit((serviceForm) => {
  console.log('serviceForm', serviceForm)
  emit('create', serviceForm)
  modal.value = false
})

const onUpdate = handleSubmit((serviceForm) => {
  console.log('service id', props.serviceData?.id)
  console.log('serviceForm', serviceForm)
  if (props.serviceData?.id) {
    emit('update', {
      id: props.serviceData?.id,
      formData: serviceForm,
    })
  }
  modal.value = false
})

const onRemove = () => {
  console.log('service id', props.serviceData?.id)
  if (props.serviceData?.id) {
    if (process.client) {
      const confirmed = window.confirm('本当に削除してもよろしいですか？')
      if (confirmed) {
        emit('remove', props.serviceData.id)
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
    :is-update="!!serviceData?.id"
    :activaterLabel="activaterLabel"
    :activater-size="activaterSize"
  />
  <GuiContentFormDialog v-model:modal="modal" :is-update="!!serviceData?.id">
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
      <div class="mt-3">
        <BaseWysiwsgEditor
          v-model="formData.caption.value.value"
          :error-messages="formData.caption.errorMessage.value"
          clearable
          label="紹介文"
          placeholder="紹介文を入力してください"
        />
      </div>
      <div class="mt-3">
        <BaseWysiwsgEditor
          v-model="formData.body.value.value"
          :error-messages="formData.body.errorMessage.value"
          clearable
          label="本文"
          placeholder="本文を入力してください"
        />
      </div>
      <div class="mt-2 mb-2 d-flex justify-space-between">
        <div>
          <v-btn
            v-if="serviceData?.id"
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
            v-if="serviceData?.id"
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
            登録する
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
