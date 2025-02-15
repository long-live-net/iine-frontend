<script setup lang="ts">
import type { InformationType } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
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

await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="informationRef"
        :can-edit="canEdit"
        @update="updatingData = $event"
        @create="updatingData = null"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      />
    </CommonContentCard>
  </CommonContentWrap>
  <ManageContentInformation
    v-model:modal="editModal"
    :information-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
