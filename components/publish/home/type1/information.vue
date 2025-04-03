<script setup lang="ts">
import type { InformationType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
  informationRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
  loading,
} = useInformationActions(customerId)

const editModal = ref(false)
const updatingData = ref<InformationType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditMode = (mode: ContentEditMode) => {
  if (mode === 'new') {
    updatingData.value = null
  } else {
    updatingData.value = informationRef.value
  }
  editMode.value = mode
}

await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="informationRef"
        :content-title="contentTitle"
        :can-edit="canEdit"
        @edit-mode="onEditMode"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      >
      </PublishContentDetailItem>
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentInformation
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :information-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
