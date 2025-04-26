<script setup lang="ts">
import type { FeatureType } from '@/types/content'
import { useFeatureListActions } from '~/composables/use-content/use-features'

withDefaults(
  defineProps<{
    noCaption?: boolean
  }>(),
  { noCaption: false }
)
defineEmits<{
  select: [feature: FeatureType]
}>()

const editModal = ref(false)
const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const { customerId } = useCustomer()
const {
  contentTitle,
  filter,
  sort,
  pager,
  featureListRef,
  loading,
  onLoad,
  onGetList,
} = useFeatureListActions(customerId)

defineExpose({ onGetList })

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <PublishContentGridTable
      v-if="featureListRef?.length"
      v-model:modal="editModal"
      :content-title="contentTitle"
      :items="featureListRef"
      small
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          :see-detail-path="`/features/${content.id}`"
          :is-current="content.id === contentId"
          :no-caption="noCaption"
          item-shape="circle"
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
</template>
