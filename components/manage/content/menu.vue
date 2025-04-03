<script setup lang="ts">
import type { MenuType, MenuForm, ContentEditMode } from '@/types/content'
import { getMenuKind } from '@/composables/use-content/use-menu'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    menuData?: MenuType | null
  }>(),
  {
    menuData: null,
  }
)
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
    resetMenuForm(props.menuData)
  }
})

const onCreate = handleSubmit((menuForm) => {
  emit('create', menuForm)
  modal.value = false
})

const onUpdate = handleSubmit((menuForm) => {
  if (!props.menuData?.id) {
    return
  }
  emit('update', {
    id: props.menuData?.id,
    formData: menuForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.menuData?.id) {
    return
  }
  emit('remove', props.menuData.id)
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
      <ManageContentFormActions
        :content-id="menuData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
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
