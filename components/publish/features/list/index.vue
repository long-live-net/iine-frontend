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

const route = useRoute()
const contentId = parseInt(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

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

const contentGridMaxWidth = computed(() =>
  featureListRef.value && featureListRef.value.length < 4 ? '60rem' : '80rem'
)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <div class="feature-list">
      <CommonContentGrid
        v-if="featureListRef?.length"
        :contents="featureListRef"
        :content-grid-max-width="contentGridMaxWidth"
        grid-min-width="14rem"
        grid-max-width="18rem"
      >
        <template #default="{ content }">
          <PublishFeaturesListItem
            :item="content"
            :is-current="content.id === contentId"
            :no-caption="noCaption"
            @select="onMovingDetailPage"
          />
        </template>
      </CommonContentGrid>
    </div>
  </CommonContentWrap>
</template>

<style lang="scss" scoped>
.feature-list {
  width: 100%;
  margin: 0 auto;
}
</style>
