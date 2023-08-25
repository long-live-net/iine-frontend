<script setup lang="ts">
import type { ServiceType, ServiceForm } from '@/types/content'
import type { ListFilter, ListSort, ListPager } from '@/types/content-api'

const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

const {
  nextKey,
  getServiceList,
  setServiceListPositions,
  serviceListRef,
  loading: readLoading,
} = useServiceRead(customerId)

const {
  createService,
  updateService,
  removeService,
  updateServiceListPositions,
  loading: writeLoading,
} = useServiceWrite(customerId)

const getServiceListWithPageCondition = async () => {
  const filter: ListFilter = {}
  const sort: ListSort = { position: 1 }
  const pager: ListPager = { page: 1, limit: 12 }
  await getServiceList(filter, sort, pager)
}

const onCreate = async (formData: ServiceForm) => {
  await createService(formData)
  nextKey()
  getServiceListWithPageCondition()
}

const onUpdate = async ({
  id,
  formData,
}: {
  id: number
  formData: ServiceForm
}) => {
  if (!id) return

  await updateService(id, formData)
  nextKey()
  getServiceListWithPageCondition()
}

const onRemove = async (id: number) => {
  await removeService(id)
  nextKey()
  getServiceListWithPageCondition()
}

const onUpdatePositions = async (services: ServiceType[]) => {
  await updateServiceListPositions(setServiceListPositions(services))
  nextKey()
  getServiceListWithPageCondition()
}

const loading = computed(() => readLoading.value || writeLoading.value)

await getServiceListWithPageCondition()
</script>

<template>
  <GuiContentWrap :loading="false" class="type1-services">
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
              <SectionsEditService
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
          <SectionsEditService
            activaterLabel="コンテンツを登録してください"
            @create="onCreate"
          />
        </div>
      </div>
      <div v-if="serviceListRef?.length" class="create-activator">
        <SectionsEditService @create="onCreate" />
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
