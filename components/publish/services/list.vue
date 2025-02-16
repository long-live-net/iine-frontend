<script setup lang="ts">
import type { ServiceType } from '@/types/content'

withDefaults(defineProps<{ noCaption?: boolean }>(), { noCaption: false })

const editModal = ref(false)
const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const { customerId } = useCustomer()
const { filter, sort, pager, serviceListRef, loading, onLoad, onGetList } =
  useServiceListActions(customerId)

defineExpose({ onGetList })

const router = useRouter()
const onMovingDetailPage = (service: ServiceType) => {
  router.push(`/services/${service.id}`)
}

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <div class="service-list">
      <PublishContentGridTable
        v-model:modal="editModal"
        :items="serviceListRef"
        :can-edit="false"
        small
      >
        <template #default="{ content }">
          <PublishContentGridItem
            :item="content"
            eyecatch-shape="circle"
            :is-current="content.id === contentId"
            no-caption
            @select="onMovingDetailPage"
          />
        </template>
      </PublishContentGridTable>
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
