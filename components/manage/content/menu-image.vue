<script setup lang="ts">
import type {
  MenuImageType,
  MenuImageForm,
  ContentEditMode,
} from '@/types/content'
import { getMenuImageKind } from '@/composables/use-content/use-menu-image'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    menuImageData?: MenuImageType | null
  }>(),
  {
    menuImageData: null,
  }
)
const emit = defineEmits<{
  create: [inputData: MenuImageForm]
  update: [{ id: string; formData: MenuImageForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getMenuImageKind()
const menuType = ref<string>('image')

const { handleSubmit, handleReset, formData, resetMenuImageForm } =
  useMenuImageForm()

const accessibles = getAccesstablePdfTypes()
watch(modal, (current) => {
  if (current) {
    handleReset()
    resetMenuImageForm(props.menuImageData)
    menuType.value = accessibles.includes(formData.menuImageType.value.value)
      ? 'pdf'
      : 'image'
  }
})

const onCreate = handleSubmit((menuImageForm) => {
  emit('create', menuImageForm)
  modal.value = false
})

const onUpdate = handleSubmit((menuImageForm) => {
  if (!props.menuImageData?.id) {
    return
  }
  emit('update', {
    id: props.menuImageData?.id,
    formData: menuImageForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.menuImageData?.id) {
    return
  }
  emit('remove', props.menuImageData.id)
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
      <div>
        <label style="color: #7e7e7e">メニュー用ファイル</label>
        <v-radio-group v-model="menuType" inline hide-details>
          <v-radio label="画像ファイル" value="image"></v-radio>
          <v-radio label="PDFファイル" value="pdf"></v-radio>
        </v-radio-group>
      </div>
      <div>
        <CommonContentInputImage
          v-if="menuType === 'image'"
          v-model:url="formData.menuImageUrl.value.value"
          v-model:name="formData.menuImageName.value.value"
          v-model:type="formData.menuImageType.value.value"
          :error-messages="formData.menuImageUrl.errorMessage.value"
          label="メニュー画像"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
        <CommonContentInputFile
          v-else
          v-model:url="formData.menuImageUrl.value.value"
          v-model:name="formData.menuImageName.value.value"
          v-model:type="formData.menuImageType.value.value"
          :accessables="accessibles"
          :error-messages="formData.menuImageUrl.errorMessage.value"
          label="メニュー用 PDF ファイルを登録してください"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <ManageContentFormActions
        :content-id="menuImageData?.id"
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
