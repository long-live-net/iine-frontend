<script setup lang="ts">
import type { FeatureType, ContentEditMode } from '@/types/content'
import { useFeatureListActions } from '~/composables/use-content/use-features'

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
} = useFeatureListActions(customerId)

const router = useRouter()
const onMovingDetailPage = (feature: FeatureType) => {
  router.push(`/features/${feature.id}`)
}

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
  editMode.value = mode
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
          :reverse="index % 2 === 1"
          @select="onMovingDetailPage"
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
