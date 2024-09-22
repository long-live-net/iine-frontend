<script setup lang="ts">
import type { MenuImageType } from '@/types/content'

const { customerId, canEdit } = useFoundation()
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
                :menu-image-data="content as MenuImageType"
                activater-size="x-small"
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
            activater-label="コンテンツを登録してください"
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
  }
}

.menu-image-item {
  position: relative;

  .edit-activator {
    position: absolute;
    top: -4px;
    left: -4px;
  }
}

.menu-omage-viewer {
  width: calc(80vw - 4rem);
  height: auto;
  margin: 0 auto;

  @media only screen and (max-width: $grid-breakpoint-md) {
    width: calc(90vw - 4rem);
  }
  @media only screen and (max-width: $grid-breakpoint-sm) {
    width: calc(100vw - 4rem);
  }

  img {
    width: 100%;
    height: auto;
  }
}
</style>
