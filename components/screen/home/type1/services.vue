<script setup lang="ts">
import type { ServiceType } from '@/types/content'

const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

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
</script>

<template>
  <GuiContentWrap :loading="loading" class="type1-services">
    <template v-if="canEdit">
      <GuiContentGridDraggable
        v-if="serviceListRef?.length"
        :contents="serviceListRef"
        @update="onUpdatePositions($event as ServiceType[])"
      >
        <template #default="{ content }">
          <div class="service-item">
            <h5 class="service-item__title">
              {{ content.title }}
            </h5>
            <GuiEyecatchImage
              v-if="content.image"
              :url="content.image.url"
              :settings="content.image.settings"
              circle
              class="service-item__eyecatcher"
            />
            <div
              class="service-item__caption"
              v-html="htmlSanitizer((content as ServiceType).caption)"
            />
            <div class="edit-activator">
              <ScreenFormService
                :serviceData="content as ServiceType"
                activaterSize="x-small"
                @update="onUpdate"
                @remove="onRemove"
              />
            </div>
          </div>
        </template>
      </GuiContentGridDraggable>
      <div v-else class="no-items">
        <p>データがありません</p>
        <div>
          <ScreenFormService
            activaterLabel="コンテンツを登録してください"
            @create="onCreate"
          />
        </div>
      </div>
      <div v-if="serviceListRef?.length" class="create-activator">
        <ScreenFormService @create="onCreate" />
      </div>
    </template>
    <template v-else>
      <GuiContentGrid v-if="serviceListRef?.length" :contents="serviceListRef">
        <template #default="{ content }">
          <div class="service-item">
            <h5 class="service-item__title">
              {{ content.title }}
            </h5>
            <GuiEyecatchImage
              v-if="content.image"
              :url="content.image.url"
              :settings="content.image.settings"
              circle
              class="service-item__eyecatcher"
            />
            <div
              class="service-item__caption"
              v-html="htmlSanitizer((content as ServiceType).caption)"
            />
          </div>
        </template>
      </GuiContentGrid>
      <div v-else class="no-items">
        <p>データがありません</p>
      </div>
    </template>
  </GuiContentWrap>
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
      color: $warning;
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
  &__title {
    text-align: center;
    font-weight: bold;
    font-size: 1.1rem;
    margin: 0;
  }
  &__eyecatcher {
    margin-top: 1rem;
    aspect-ratio: 6 / 5;
  }
  &__caption {
    text-align: left;
    margin-top: 1rem;
  }

  .edit-activator {
    position: absolute;
    top: -4px;
    left: -4px;
  }
}
</style>
