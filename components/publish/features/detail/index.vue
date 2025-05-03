<script setup lang="ts">
import type { FeatureForm, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const {
  contentTitle,
  featureRef,
  loading: detailLoading,
  onLoad: onDetailLoad,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useFeatureActions(customerId)

const {
  filter,
  sort,
  pager,
  featureListRef,
  loading: listLoading,
  onLoad: onListLoad,
  onGetList,
} = useFeatureListActions(customerId)

const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

const loading = computed(() => detailLoading.value || listLoading.value)
const preUrl = computed<string | null>(() => {
  const curIndex =
    featureListRef.value?.findIndex((c) => c.id === contentId) ?? -1
  const preId = featureListRef.value?.[curIndex - 1]?.id
  return preId ? `/features/${preId}` : null
})
const nextUrl = computed<string | null>(() => {
  const curIndex =
    featureListRef.value?.findIndex((c) => c.id === contentId) ?? -1
  const nextId = featureListRef.value?.[curIndex + 1]?.id
  return nextId ? `/features/${nextId}` : null
})

const onUpdateData = async (params: { id: string; formData: FeatureForm }) => {
  await onUpdate(params)
  onGetList()
}
const onRemoveData = async (id: string) => {
  await onRemove(id)
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
        :item="featureRef"
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
          no-caption
          item-shape="circle"
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
  <ManageContentFeature
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :feature-data="featureRef"
    @update="onUpdateData"
    @remove="onRemoveData"
  />
</template>

<style lang="scss" scoped>
.list-gap {
  margin-top: 6rem;
}
</style>
