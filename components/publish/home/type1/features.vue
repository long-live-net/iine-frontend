<script setup lang="ts">
import type { FeatureType } from '@/types/content'
import { useFeatureListActions } from '~/composables/use-content/use-features'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
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

const editModal = ref(false)
const updatingData = ref<FeatureType | null>(null)

const router = useRouter()
const onMovingDetailPage = (feature: FeatureType) => {
  router.push(`/features/${feature.id}`)
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
      :can-edit="canEdit"
      @update="updatingData = $event"
      @create="updatingData = null"
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
  <ManageContentMenu
    v-model:modal="editModal"
    :menu-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
