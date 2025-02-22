<script setup lang="ts">
import type { ContactType } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const {
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

await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="contactRef"
        :can-edit="canEdit"
        @update="updatingData = $event"
        @create="updatingData = null"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      >
        <template #middlenavi>
          <div class="service-links-wrap">
            <PublishCustomerServiceLinks class="service-links" />
          </div>
        </template>

        <template #footernavi>
          <div class="inquire-activator">
            <PublishInquire />
          </div>
        </template>
      </PublishContentDetailItem>
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentContact
    v-model:modal="editModal"
    :contact-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>

<style lang="scss" scoped>
.service-links-wrap {
  position: relative;
  min-height: 0.5rem;

  .service-links {
    position: absolute;
    top: 0.25rem;
    right: 1rem;
  }
}

.inquire-activator {
  width: fit-content;
  margin: 0 0 0 auto;
}
</style>
