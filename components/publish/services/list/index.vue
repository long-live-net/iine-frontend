<script setup lang="ts">
import type { ContentType, ServiceType } from '@/types/content'
withDefaults(
  defineProps<{
    noCaption?: boolean
  }>(),
  { noCaption: false }
)
defineEmits<{
  select: [service: ServiceType]
}>()

const route = useRoute()
const contentId = parseInt(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

const { customerId } = useCustomer()
const { filter, sort, pager, serviceListRef, loading, onLoad, onGetList } =
  useServiceListActions(customerId)

const router = useRouter()
const onMovingDetailPage = (service: ContentType) => {
  router.push(`/services/${service.id}`)
}

defineExpose({ onGetList })

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await onLoad()

const contentGridMaxWidth = computed(() =>
  serviceListRef.value && serviceListRef.value.length < 4 ? '60rem' : '80rem'
)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <div class="service-list">
      <CommonContentGrid
        v-if="serviceListRef?.length"
        :contents="serviceListRef"
        :content-grid-max-width="contentGridMaxWidth"
        grid-min-width="14rem"
        grid-max-width="18rem"
      >
        <template #default="{ content }">
          <PublishServicesListItem
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
.service-list {
  width: 90%;
  margin: 0 auto;
  @media only screen and (max-width: $grid-breakpoint-md) {
    width: 100%;
  }
}
</style>
