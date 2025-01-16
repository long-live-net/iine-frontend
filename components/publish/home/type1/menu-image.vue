<script setup lang="ts">
import type { MenuImageType } from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
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

filter.value = {}
sort.value = { position: 1 }
pager.value = { page: 1, limit: 12 }
await onLoad()

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
</script>

<template>
  <CommonContentWrap :loading="loading" class="type1-menu-images">
    <template v-if="canEdit">
      <CommonContentGridDraggable
        v-if="menuImageListRef?.length"
        :contents="menuImageListRef"
        @update="onUpdatePositions($event as MenuImageType[])"
      >
        <template #default="{ content }">
          <div class="menu-image-item">
            <PublishMenuImagesListItem
              :item="content"
              @select="onClickEyecatch($event)"
            />
            <div class="edit-activator">
              <ManageContentMenuImage
                :menu-image-data="content"
                activator-size="x-small"
                @update="onUpdate"
                @remove="onRemove"
              />
            </div>
          </div>
        </template>
      </CommonContentGridDraggable>
      <div v-else class="no-items">
        <p>データがありません</p>
        <div>
          <ManageContentMenuImage
            activator-label="コンテンツを登録してください"
            @create="onCreate"
          />
        </div>
      </div>
      <div v-if="menuImageListRef?.length" class="create-activator">
        <ManageContentMenuImage @create="onCreate" />
      </div>
    </template>
    <template v-else>
      <CommonContentGrid
        v-if="menuImageListRef?.length"
        :contents="menuImageListRef"
      >
        <template #default="{ content }">
          <PublishMenuImagesListItem
            :item="content"
            @select="onClickEyecatch($event)"
          />
        </template>
      </CommonContentGrid>
      <div v-else class="no-items">
        <p>データがありません</p>
      </div>
    </template>
  </CommonContentWrap>

  <CommonModalDialog
    v-model:modal="imageViewModal"
    :title="imageViewTitle"
    title-icon="mdi-silverware"
    title-icon-color="orange"
    theme="auto"
    max-width="98vw"
  >
    <div class="menu-omage-viewer">
      <img :src="imageViewFileUrl" />
    </div>
  </CommonModalDialog>
</template>

<style lang="scss" scoped>
.type1-menu-images {
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
      color: $accent;
    }
  }
  .create-activator {
    position: absolute;
    top: -1rem;
    right: 5rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      right: 1rem;
    }
  }
}

.menu-image-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: -8px;
    left: 4px;
  }
}

.menu-omage-viewer {
  margin: 0 auto;

  img {
    display: block;
    margin: 0 auto;
    width: calc(100dvw - 180px);
    max-width: 1280px;
    max-height: calc(100dvh - 250px);
    object-fit: contain;

    @media only screen and (max-width: $grid-breakpoint-lg) {
      width: calc(100dvw - 100px);
    }
    @media only screen and (max-width: $grid-breakpoint-md) {
      width: calc(100dvw - 60px);
    }
    @media only screen and (max-width: $grid-breakpoint-sm) {
      width: calc(100dvw - 50px);
    }
  }
}
</style>
