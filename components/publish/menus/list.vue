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
  menuListRef,
  loading,
  onLoad,
  onGetList,
} = useMenuListActions(customerId)

defineExpose({ onGetList })

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 24 }
await onLoad()
</script>

<template>
  <CommonContentWrap :loading="loading">
    <PublishContentGridTable
      v-model:modal="editModal"
      :items="menuListRef"
      :content-title="contentTitle"
      :can-edit="false"
      small-if-possible
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          :see-detail-path="`/menus/${content.id}`"
          :is-current="content.id === contentId"
          item-shape="round"
          no-caption
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
</template>
