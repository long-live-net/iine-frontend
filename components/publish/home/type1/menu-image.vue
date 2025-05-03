<script setup lang="ts">
import type { MenuImageType, ContentEditMode } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  contentTitle,
  filter,
  sort,
  pager,
  menuImageListRef,
  onLoad,
  onCreate,
  onUpdate,
  onRemove,
  onUpdatePositions,
  loading,
} = useMenuImageListActions(customerId)

const imageViewModal = ref(false)
const imageViewTitle = ref('')
const imageViewFileUrl = ref('')
const onClickEyecatch = (menuImage: MenuImageType) => {
  if (import.meta.client) {
    if (getAccesstablePdfTypes().includes(menuImage.menuImage.type)) {
      window.open(menuImage.menuImage.url, '_blank')
    } else {
      imageViewModal.value = true
      imageViewTitle.value = menuImage.title
      imageViewFileUrl.value = menuImage.menuImage.url
    }
  }
}

const editModal = ref(false)
const updatingData = ref<MenuImageType | null>(null)
const editMode = ref<ContentEditMode>('update')
const onEditTarget = ({
  item,
  mode,
}: {
  item: MenuImageType | null
  mode: ContentEditMode
}) => {
  updatingData.value = item ?? null
  editMode.value = mode
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
      :items="menuImageListRef"
      :content-title="contentTitle"
      :can-edit="canEdit"
      @edit-target="onEditTarget"
      @update-positions="onUpdatePositions"
    >
      <template #default="{ content }">
        <PublishContentGridItem
          :item="content"
          see-detail-action-label="メニューを見る"
          item-shape="round"
          :caption-height="
            menuImageListRef && menuImageListRef.length > 2 ? '320px' : '260px'
          "
          @select="onClickEyecatch"
        />
      </template>
    </PublishContentGridTable>
  </CommonContentWrap>
  <ManageContentMenuImage
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :menu-image-data="updatingData"
    @create="onCreate"
    @update="onUpdate"
    @remove="onRemove"
  />
  <CommonModalDialog
    v-model:modal="imageViewModal"
    :title="imageViewTitle"
    title-icon="mdi-silverware"
    title-icon-color="orange"
    theme="auto"
    max-width="98vw"
  >
    <div class="menu-image-viewer">
      <img :src="imageViewFileUrl" />
    </div>
  </CommonModalDialog>
</template>
