<script setup lang="ts">
import type { MenuType, MenuForm } from '@/types/content'
import { getMenuKind } from '@/composables/use-content/use-menu'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{ itemData?: MenuType | null }>()
const emit = defineEmits<{
  create: [inputData: MenuForm]
  update: [{ id: string; formData: MenuForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getMenuKind()
const { handleSubmit, handleReset, formData, resetMenuForm } = useMenuForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetMenuForm(props.itemData)
  }
})

const onCreate = handleSubmit((menuForm) => {
  emit('create', menuForm)
  modal.value = false
})

const onUpdate = handleSubmit((menuForm) => {
  if (!props.itemData?.id) {
    return
  }
  emit('update', {
    id: props.itemData?.id,
    formData: menuForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.itemData?.id) {
    return
  }
  emit('remove', props.itemData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditDialog v-model:modal="modal" :is-update="!!itemData?.id">
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
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          label="タイトル"
          placeholder="タイトルを入力してください"
        />
      </div>
      <div class="mt-3">
        <CommonWysiwsgEditor
          v-model="formData.caption.value.value"
          :error-messages="formData.caption.errorMessage.value"
          clearable
          label="概要"
          placeholder="概要を入力してください"
          no-image
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <ManageContentFormActions
        :content-id="itemData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>
