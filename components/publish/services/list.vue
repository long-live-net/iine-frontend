<script setup lang="ts">
withDefaults(defineProps<{ noCaption?: boolean }>(), { noCaption: false })

const editModal = ref(false)
const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const { customerId } = useCustomer()
const {
  contentTitle,
  filter,
  sort,
  pager,
  serviceListRef,
  loading,
  onLoad,
  onGetList,
} = useServiceListActions(customerId)

defineExpose({ onGetList })

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <PublishContentGridTable
      v-model:modal="editModal"
      :content-title="contentTitle"
      :items="serviceListRef"
      :can-edit="false"
      small-if-possible
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
</template>
