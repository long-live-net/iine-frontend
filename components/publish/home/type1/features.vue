<script setup lang="ts">
import type { ContentType } from '@/types/content'
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

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 24 }
await onLoad()

const router = useRouter()
const onMovingDetailPage = (feature: ContentType) => {
  router.push(`/features/${feature.id}`)
}
</script>

<template>
  <CommonContentWrap :loading="loading" class="type1-features">
    <template v-if="canEdit">
      <CommonContentGridRowDraggable
        v-if="featureListRef?.length"
        :contents="featureListRef"
        @update="onUpdatePositions"
      >
        <template #default="{ content, index }">
          <div class="feature-item">
            <PublishFeaturesListItemRow
              :item="content"
              :reverse="index % 2 === 1"
              @select="onMovingDetailPage"
            />
            <div class="edit-activator">
              <ManageContentFeature
                :feature-data="content"
                @update="onUpdate"
                @remove="onRemove"
              />
            </div>
          </div>
        </template>
      </CommonContentGridRowDraggable>
      <div v-else class="no-items">
        <p>データがありません</p>
        <div>
          <ManageContentFeature
            activator-label="コンテンツを登録してください"
            @create="onCreate"
          />
        </div>
      </div>
      <div v-if="featureListRef?.length" class="create-activator">
        <ManageContentFeature @create="onCreate" />
      </div>
    </template>
    <template v-else>
      <CommonContentGridRow
        v-if="featureListRef?.length"
        :contents="featureListRef"
      >
        <template #default="{ content, index }">
          <PublishFeaturesListItemRow
            :item="content"
            :reverse="index % 2 === 1"
            @select="onMovingDetailPage"
          />
        </template>
      </CommonContentGridRow>
      <div v-else class="no-items">
        <p>データがありません</p>
      </div>
    </template>
  </CommonContentWrap>
</template>

<style lang="scss" scoped>
.type1-features {
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

    @media only screen and (max-width: $grid-breakpoint-md) {
      right: 1rem;
    }
  }
}

.feature-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: -8px;
    left: 4px;
  }
}
</style>
