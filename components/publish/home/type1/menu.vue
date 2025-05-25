<script setup lang="ts">
import type { MenuType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
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
  isMaximumLimit,
} = useMenuListActions(customerId)

const editModal = ref(false)
const updatingData = ref<MenuType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditTarget = ({
  item,
  mode,
}: {
  item: MenuType | null
  mode: ContentEditMode
}) => {
  updatingData.value = item ?? null
  editMode.value =
    mode === 'new' && isMaximumLimit.value ? 'maximumLimit' : mode
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
      :content-title="contentTitle"
      :can-edit="canEdit"
      @edit-target="onEditTarget"
      @update-positions="onUpdatePositions"
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          :see-detail-path="`/menus/${content.id}`"
          see-detail-action-label="メニューを見る"
          item-shape="round"
          :caption-height="
            menuListRef && menuListRef.length > 2 ? '320px' : '260px'
          "
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
  <ManageContentMenu
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :menu-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
</template>
