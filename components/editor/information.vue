<script setup lang="ts">
import type { InformationType, InformationForm } from '@/types/content'

const props = defineProps<{
  informationData?: InformationType | null
  activaterLabel?: string
}>()
const emit = defineEmits<{
  create: [inputData: InformationForm]
  update: [{ id: number; formData: InformationForm }]
  remove: [id: number]
}>()

const modal = ref(false)
const {
  handleSubmit,
  handleReset,
  formData,
  resetInformationForm,
  changeImageFile,
} = useInformationForm()

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
  if (props.informationData?.id) {
    emit('update', {
      id: props.informationData.id,
      formData: informationForm,
    })
  }
  modal.value = false
})

const onRemove = () => {
  if (props.informationData?.id) {
    if (process.client) {
      const confirmed = window.confirm('本当に削除してもよろしいですか？')
      if (confirmed) {
        emit('remove', props.informationData.id)
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
    :is-update="!!informationData?.id"
    :activaterLabel="activaterLabel"
  />
  <GuiContentFormDialog
    v-model:modal="modal"
    :is-update="!!informationData?.id"
  >
    <v-form>
      <div>
        <BaseFileInput
          :image-url="formData.image.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="タイトル画像"
          @change-image-file="changeImageFile"
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
        <v-text-field
          v-model="formData.subtitle.value.value"
          :error-messages="formData.subtitle.errorMessage.value"
          clearable
          label="サブタイトル"
          placeholder="サブタイトルを入力してください"
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
        <div class="g-block-sm">
          <v-btn
            v-if="informationData?.id"
            prepend-icon="mdi-delete"
            color="error"
            variant="outlined"
            stacked
            @click="onRemove"
          >
            削除
          </v-btn>
        </div>
        <div class="g-block-sm">
          <v-btn
            v-if="informationData?.id"
            prepend-icon="mdi-content-save"
            color="success"
            variant="flat"
            stacked
            @click="onUpdate"
          >
            更新
          </v-btn>
          <v-btn
            v-else
            prepend-icon="mdi-content-save"
            color="info"
            variant="flat"
            stacked
            @click="onCreate"
          >
            作成
          </v-btn>
          <v-btn
            prepend-icon="mdi-cancel"
            color="secondary"
            variant="flat"
            stacked
            class="ml-1"
            @click="onCancel"
          >
            中止
          </v-btn>
        </div>
        <div class="g-block-lg">
          <v-btn
            v-if="informationData?.id"
            prepend-icon="mdi-delete"
            color="error"
            variant="outlined"
            width="8rem"
            @click="onRemove"
          >
            削除する
          </v-btn>
        </div>
        <div class="g-block-lg">
          <v-btn
            v-if="informationData?.id"
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
            color="secondary"
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
