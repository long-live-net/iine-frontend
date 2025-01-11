<script setup lang="ts">
import type { ServiceType, ContentType } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
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

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await onLoad()

const router = useRouter()
const onMovingDetailPage = (service: ContentType) => {
  router.push(`/services/${service.id}`)
}
</script>

<template>
  <CommonContentWrap :loading="loading" class="type1-services">
    <template v-if="canEdit">
      <CommonContentGridDraggable
        v-if="serviceListRef?.length"
        :contents="serviceListRef"
        @update="onUpdatePositions($event as ServiceType[])"
      >
        <template #default="{ content }">
          <div class="service-item">
            <PublishServicesListItem
              :item="content"
              @select="onMovingDetailPage"
            />
            <div class="edit-activator">
              <ManageContentService
                :service-data="content as ServiceType"
                activator-size="x-small"
                @update="onUpdate"
                @remove="onRemove"
              />
            </div>
          </div>
        </template>
      </CommonContentGridDraggable>
      <div v-else class="no-items">
        <p>データがありません</p>
        <div>
          <ManageContentService
            activator-label="コンテンツを登録してください"
            @create="onCreate"
          />
        </div>
      </div>
      <div v-if="serviceListRef?.length" class="create-activator">
        <ManageContentService @create="onCreate" />
      </div>
    </template>
    <template v-else>
      <CommonContentGrid
        v-if="serviceListRef?.length"
        :contents="serviceListRef"
      >
        <template #default="{ content }">
          <PublishServicesListItem
            :item="content"
            @select="onMovingDetailPage"
          />
        </template>
      </CommonContentGrid>
      <div v-else class="no-items">
        <p>データがありません</p>
      </div>
    </template>
  </CommonContentWrap>
</template>

<style lang="scss" scoped>
.type1-services {
  position: relative;
  padding: 0.2rem;
  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
    margin-top: 1rem;
    p {
      font-weight: bold;
      color: $accent;
    }
  }
  .create-activator {
    position: absolute;
    top: -1rem;
    right: 5rem;
  }
}

.service-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: -8px;
    left: 4px;
  }
}
</style>
