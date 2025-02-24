<script setup lang="ts">
import type { ContentType, FeatureType } from '@/types/content'
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
const { filter, sort, pager, featureListRef, loading, onLoad, onGetList } =
  useFeatureListActions(customerId)

const router = useRouter()
const onMovingDetailPage = (feature: ContentType) => {
  router.push(`/features/${feature.id}`)
}

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
      :items="featureListRef"
      small-if-possible
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          eyecatch-shape="circle"
          :is-current="content.id === contentId"
          :no-caption="noCaption"
          @select="onMovingDetailPage"
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
</template>
