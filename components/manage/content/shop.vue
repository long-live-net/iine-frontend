<script setup lang="ts">
import type { UiSelectItem } from '~/types/ui'
import type { ShopType, ShopForm, ContentEditMode } from '@/types/content'
import { getShopKind } from '@/composables/use-content/use-shop'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    contentTitle: string
    editMode: ContentEditMode
    shopData?: ShopType | null
    currentCategoryId?: string | null
    categorySelectItems?: UiSelectItem[]
  }>(),
  {
    shopData: null,
    currentCategoryId: '',
    categorySelectItems: () => [],
  }
)
const emit = defineEmits<{
  create: [inputData: ShopForm]
  update: [{ id: string; formData: ShopForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getShopKind()

const { handleSubmit, handleReset, formData, resetShopForm } = useShopForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetShopForm(props.shopData, props.currentCategoryId)
  }
})

const onCreate = handleSubmit((shopForm) => {
  emit('create', shopForm)
  modal.value = false
})

const onUpdate = handleSubmit((shopForm) => {
  if (!props.shopData?.id) {
    return
  }
  emit('update', {
    id: props.shopData.id,
    formData: shopForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.shopData?.id) {
    return
  }
  emit('remove', props.shopData.id)
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
      <div
        v-if="['new', 'update', 'image', 'caption'].includes(editMode)"
        class="mt-3"
      >
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
      <template v-if="['new', 'update', 'caption'].includes(editMode)">
        <div class="row-wrapper mt-3">
          <div class="row-field">
            <v-text-field
              v-model="formData.title.value.value"
              :error-messages="formData.title.errorMessage.value"
              clearable
              label="タイトル"
              placeholder="タイトルを入力してください"
            />
          </div>
          <div class="row-field">
            <v-select
              v-model="formData.categoryId.value.value"
              :error-messages="formData.categoryId.errorMessage.value"
              :items="categorySelectItems"
              item-title="label"
              item-value="value"
              label="カテゴリ"
            />
          </div>
        </div>
      </template>
      <template v-else-if="['title', 'image'].includes(editMode)">
        <div class="mt-3">
          <v-text-field
            v-model="formData.title.value.value"
            :error-messages="formData.title.errorMessage.value"
            clearable
            label="タイトル"
            placeholder="タイトルを入力してください"
          />
        </div>
      </template>
      <template v-else-if="['body'].includes(editMode)">
        <div class="mt-3">
          <v-select
            v-model="formData.categoryId.value.value"
            :error-messages="formData.categoryId.errorMessage.value"
            :items="categorySelectItems"
            item-title="label"
            item-value="value"
            label="カテゴリ"
          />
        </div>
      </template>
      <div v-if="['new', 'update', 'caption'].includes(editMode)" class="mt-3">
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
      <div v-if="['body'].includes(editMode)" class="mt-3">
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
        :content-id="shopData?.id"
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

  .row-wrapper {
    display: flex;
    flex-flow: row nowrap;
    column-gap: 1rem;

    .row-field {
      width: calc(50% - 0.5rem);
    }
  }

  @media only screen and (max-width: $grid-breakpoint-sm) {
    width: 75dvw;

    .row-wrapper {
      flex-flow: column;
      align-items: stretch;
      column-gap: normal;

      .row-field {
        width: auto;
      }
    }
  }
}
</style>
