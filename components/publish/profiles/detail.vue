<script setup lang="ts">
import type { ProfileForm, ContentEditMode } from '@/types/content'
const emit = defineEmits<{ 'update:data': [] }>()

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const {
  contentTitle,
  profileRef,
  loading,
  onLoad,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useProfileActions(customerId)

const onUpdateData = async (params: { id: string; formData: ProfileForm }) => {
  await onUpdate(params)
  emit('update:data')
}
const onRemoveData = async (id: string) => {
  await onRemove(id)
  emit('update:data')
}

const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="profileRef"
        :content-title="contentTitle"
        :can-edit="canEdit"
        no-image
        @edit-mode="editMode = $event"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      />
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentProfile
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :profile-data="profileRef"
    @update="onUpdateData"
    @remove="onRemoveData"
  />
</template>
