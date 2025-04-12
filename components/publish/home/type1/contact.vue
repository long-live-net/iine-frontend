<script setup lang="ts">
import type { ContactType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const {
  contentTitle,
  contactRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
  loading,
} = useContactActions(customerId)

const editModal = ref(false)
const updatingData = ref<ContactType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditMode = (mode: ContentEditMode) => {
  if (mode === 'new') {
    updatingData.value = null
  } else {
    updatingData.value = contactRef.value
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
        :item="contactRef"
        :content-title="contentTitle"
        :can-edit="canEdit"
        @edit-mode="onEditMode"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      >
        <template #middlenavi>
          <div class="contact-middle-navi">
            <div class="contact-middle-navi__actions">
              <div class="d-flex">
                <PublishInquire />
                <PublishCustomerServiceLinks />
              </div>
            </div>
          </div>
        </template>
      </PublishContentDetailItem>
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentContact
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :contact-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>

<style lang="scss" scoped>
.contact-middle-navi {
  position: relative;
  min-height: 0.5rem;

  &__actions {
    position: absolute;
    top: 0.25rem;
    right: 1rem;
  }
}
</style>
