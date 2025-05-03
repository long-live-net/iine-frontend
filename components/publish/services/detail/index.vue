<script setup lang="ts">
import type { ServiceForm, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const {
  contentTitle,
  serviceRef,
  loading: detailLoading,
  onLoad: onDetailLoad,
  onUpdate: onDetailUpdate,
  onRemove: onDetailRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useServiceActions(customerId)

const {
  filter,
  sort,
  pager,
  serviceListRef,
  loading: listLoading,
  onLoad: onListLoad,
  onGetList,
} = useServiceListActions(customerId)

const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

const preUrl = computed<string | null>(() => {
  const curIndex =
    serviceListRef.value?.findIndex((s) => s.id === contentId) ?? -1
  const preId = serviceListRef.value?.[curIndex - 1]?.id
  return preId ? `/services/${preId}` : null
})
const nextUrl = computed<string | null>(() => {
  const curIndex =
    serviceListRef.value?.findIndex((s) => s.id === contentId) ?? -1
  const nextId = serviceListRef.value?.[curIndex + 1]?.id
  return nextId ? `/services/${nextId}` : null
})
const loading = computed(() => detailLoading.value || listLoading.value)

const onUpdateData = async (params: { id: string; formData: ServiceForm }) => {
  await onDetailUpdate(params)
  onGetList()
}
const onRemoveData = async (id: string) => {
  await onDetailRemove(id)
  onGetList()
}

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await Promise.all([onDetailLoad(contentId), onListLoad()])
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="serviceRef"
        :content-title="contentTitle"
        :can-edit="canEdit"
        no-image-parallax
        @edit-mode="editMode = $event"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      >
        <template #middlenavi>
          <CommonContentPreNextNagivation
            :pre-url="preUrl"
            :next-url="nextUrl"
          />
        </template>
      </PublishContentDetailItem>
    </CommonContentCard>
  </CommonContentWrap>
  <CommonContentWrap :loading="loading" class="list-gap">
    <PublishContentGridTable
      v-model:modal="editModal"
      :content-title="contentTitle"
      :items="serviceListRef"
      :can-edit="false"
      small
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          :see-detail-path="`/services/${content.id}`"
          :is-current="content.id === contentId"
          item-shape="circle"
          no-caption
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
  <ManageContentService
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :service-data="serviceRef"
    @update="onUpdateData"
    @remove="onRemoveData"
  />
</template>

<style lang="scss" scoped>
.list-gap {
  margin-top: 6rem;
}
</style>
