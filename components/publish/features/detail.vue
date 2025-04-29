<script setup lang="ts">
import type { FeatureForm, ContentEditMode } from '@/types/content'
const emit = defineEmits<{ 'update:data': [] }>()

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const {
  contentTitle,
  featureRef,
  featurePreNextIdRefRef,
  loading,
  onLoad,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useFeatureActions(customerId)

const onUpdateData = async (params: { id: string; formData: FeatureForm }) => {
  await onUpdate(params)
  emit('update:data')
}
const onRemoveData = async (id: string) => {
  await onRemove(id)
  emit('update:data')
}

const preUrl = computed(() =>
  featurePreNextIdRefRef.value?.preId
    ? `/features/${featurePreNextIdRefRef.value.preId}`
    : null
)
const nextUrl = computed(() =>
  featurePreNextIdRefRef.value?.nextId
    ? `/features/${featurePreNextIdRefRef.value.nextId}`
    : null
)

const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

await onLoad(contentId)
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
  <ManageContentFeature
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :feature-data="featureRef"
    @update="onUpdateData"
    @remove="onRemoveData"
  />
</template>
