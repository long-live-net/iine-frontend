<script setup lang="ts">
import type { MenuDetailType, MenuDetailForm } from '@/types/content'
import { getMenuDetailKind } from '@/composables/use-content/use-menu-detail'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{ menuDetailData?: MenuDetailType | null }>()
const emit = defineEmits<{
  create: [inputData: MenuDetailForm]
  update: [{ id: string; formData: MenuDetailForm }]
  remove: [id: string]
}>()

const { customerId } = useCustomer()
const apiKind = getMenuDetailKind()
const { handleSubmit, handleReset, formData, resetMenuDetailForm } =
  useMenuDetailForm()

watch(modal, (current) => {
  if (current) {
    handleReset()
    resetMenuDetailForm(props.menuDetailData)
  }
})

const onCreate = handleSubmit((MenuDetailForm) => {
  emit('create', MenuDetailForm)
  modal.value = false
})

const onUpdate = handleSubmit((MenuDetailForm) => {
  if (!props.menuDetailData?.id) {
    return
  }
  emit('update', {
    id: props.menuDetailData?.id,
    formData: MenuDetailForm,
  })
  modal.value = false
})

const onRemove = () => {
  if (!props.menuDetailData?.id) {
    return
  }
  emit('remove', props.menuDetailData.id)
  modal.value = false
}

const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <CommonContentEditDialog
    v-model:modal="modal"
    :is-update="!!menuDetailData?.id"
  >
    <v-form class="menu-detail-form">
      <div>
        <CommonContentInputImage
          v-model:url="formData.image.value.value"
          v-model:name="formData.imageName.value.value"
          v-model:type="formData.imageType.value.value"
          v-model:settings="formData.imageSettings.value.value"
          :error-messages="formData.image.errorMessage.value"
          label="サンプル画像"
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <div class="mt-3">
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          label="メニュー名"
          placeholder="メニュー名を入力してください"
        />
      </div>
      <div class="row-wrapper mt-3">
        <div class="row-field">
          <v-text-field
            v-model="formData.price.value.value"
            :error-messages="formData.price.errorMessage.value"
            clearable
            label="価格"
            placeholder="1,000円 または ¥1,000 のように入力してください"
          />
        </div>
        <div class="row-field">
          <v-switch
            v-model="formData.isHilight.value.value"
            :error-messages="formData.isHilight.errorMessage.value"
            color="primary"
          >
            <template #label>
              <small><b>おすすめ設定</b></small>
            </template>
          </v-switch>
        </div>
      </div>
      <div class="mt-3">
        <CommonWysiwygEditor
          v-model="formData.caption.value.value"
          :error-messages="formData.caption.errorMessage.value"
          clearable
          label="メニューの説明"
          placeholder="メニューの説明文を入力してください"
          simple-text
          no-image
          :customer-id="customerId"
          :api-kind="apiKind"
        />
      </div>
      <ManageContentFormActions
        :content-id="menuDetailData?.id"
        class="mt-4 mb-2"
        @create="onCreate"
        @update="onUpdate"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </v-form>
  </CommonContentEditDialog>
</template>

<style scoped lang="scss">
.menu-detail-form {
  .row-wrapper {
    display: flex;
    flex-flow: row nowrap;
    column-gap: 1rem;

    .row-field {
      flex: 1 1 50%;
    }

    @media only screen and (max-width: $grid-breakpoint-sm) {
      flex-flow: column;
      align-items: stretch;
      column-gap: normal;

      .row-field {
        flex: 0 1 auto;
      }
    }
  }
}
</style>
