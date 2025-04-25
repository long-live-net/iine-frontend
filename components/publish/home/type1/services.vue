<script setup lang="ts">
import type { ServiceType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
  filter,
  sort,
  pager,
  serviceListRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdatePositions,
  loading,
} = useServiceListActions(customerId)

const editModal = ref(false)
const updatingData = ref<ServiceType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditTarget = ({
  item,
  mode,
}: {
  item: ServiceType | null
  mode: ContentEditMode
}) => {
  updatingData.value = item ?? null
  editMode.value = mode
}

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 24 }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <PublishContentGridTable
      v-model:modal="editModal"
      :items="serviceListRef"
      :content-title="contentTitle"
      :can-edit="canEdit"
      @edit-target="onEditTarget"
      @update-positions="onUpdatePositions"
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          :see-detail-path="`/services/${content.id}`"
          item-shape="circle"
          caption-height="320px"
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
  <ManageContentService
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :service-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
