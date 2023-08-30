<script setup lang="ts">
import type { EyecatchType, EyecatchForm } from '@/types/content'
import { useEyecatchForm } from '~/composables/use-content-eyecatch'

const props = defineProps<{
  eyecatchData?: EyecatchType | null
  activaterLabel?: string
}>()

const emit = defineEmits<{
  create: [inputData: EyecatchForm]
  update: [{ id: number; formData: EyecatchForm }]
  remove: [id: number]
}>()

const modal = ref(false)
const {
  handleSubmit,
  handleReset,
  formData,
  resetEyeCatchForm,
  changeImageFile,
} = useEyecatchForm()

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
  if (props.eyecatchData?.id) {
    emit('update', {
      id: props.eyecatchData.id,
      formData: eyecatchForm,
    })
  }
  modal.value = false
})

const onRemove = () => {
  if (props.eyecatchData?.id) {
    if (process.client) {
      const confirmed = window.confirm('本当に削除してもよろしいですか？')
      if (confirmed) {
        emit('remove', props.eyecatchData.id)
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
    :is-update="!!eyecatchData?.id"
    :activaterLabel="activaterLabel"
  />
  <GuiContentFormDialog v-model:modal="modal" :is-update="!!eyecatchData?.id">
    <v-form>
      <div>
        <BaseFileInput
          :image-url="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="トップ画像"
          @change-image-file="changeImageFile"
        />
      </div>
      <div class="mt-3">
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          label="トップタイトル"
          placeholder="トップタイトルを入力してください"
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
      <div class="mt-2 mb-2 d-flex justify-space-between">
        <div>
          <v-btn
            v-if="eyecatchData?.id"
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
            v-if="eyecatchData?.id"
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
