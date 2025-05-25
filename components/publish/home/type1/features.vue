<script setup lang="ts">
import type { FeatureType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
  filter,
  sort,
  pager,
  featureListRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdatePositions,
  loading,
  isMaximumLimit,
} = useFeatureListActions(customerId)

const editModal = ref(false)
const updatingData = ref<FeatureType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditTarget = ({
  item,
  mode,
}: {
  item: FeatureType | null
  mode: ContentEditMode
}) => {
  updatingData.value = item ?? null
  editMode.value =
    mode === 'new' && isMaximumLimit.value ? 'maximumLimit' : mode
}

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 24 }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <PublishContentGridTableRow
      v-model:modal="editModal"
      :items="featureListRef"
      :content-title="contentTitle"
      :can-edit="canEdit"
      @edit-target="onEditTarget"
      @update-positions="onUpdatePositions"
    >
      <template #default="{ content, index }">
        <PublishContentGridItemRow
          :item="content"
          :see-detail-path="`/features/${content.id}`"
          :reverse="index % 2 === 1"
        />
      </template>
    </PublishContentGridTableRow>
  </CommonContentWrap>
  <ManageContentFeature
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :feature-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
