<script setup lang="ts">
import type { MenuType } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  filter,
  sort,
  pager,
  menuListRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdatePositions,
  loading,
} = useMenuListActions(customerId)

const editModal = ref(false)
const updatingData = ref<MenuType | null>(null)

const router = useRouter()
const onMovingDetailPage = (item: MenuType) => {
  router.push(`/menus/${item.id}`)
}

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
      :can-edit="canEdit"
      @update="updatingData = $event"
      @create="updatingData = null"
      @update-positions="onUpdatePositions"
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          eyecatch-shape="round"
          see-detail-action-label="メニューを見る"
          @select="onMovingDetailPage"
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
  <ManageContentMenu
    v-model:modal="editModal"
    :item-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
