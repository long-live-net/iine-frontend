<script setup lang="ts">
import type {
  MenuCategoryType,
  MenuDetailType,
  MenuDetailForm,
} from '@/types/content'
import type { MenuItem } from '@/components/base/dropdown.vue'
const emit = defineEmits<{ 'update:data': [] }>()

const CATEGORIES_LIMIT = 32
const DETAILS_LINIT = 128

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const route = useRoute()
const menuId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

/**
 * Menu データ
 */
const removeMenuModal = ref(false)
const {
  menuRef,
  menuPreNextIdRefRef,
  loading: loadingMenu,
  onLoad: onLoadMenu,
  onRemove: removeMenu,
} = useMenuActions(customerId)

const onRemoveMenu = async (id: string) => {
  await removeMenu(id)
  emit('update:data')
}
const preUrl = computed(() =>
  menuPreNextIdRefRef.value?.preId
    ? `/menus/${menuPreNextIdRefRef.value.preId}`
    : null
)
const nextUrl = computed(() =>
  menuPreNextIdRefRef.value?.nextId
    ? `/menus/${menuPreNextIdRefRef.value.nextId}`
    : null
)

/**
 * Menu Category データ
 */
const editCategoryModal = ref(false)
const editCategoryPositionModal = ref(false)
const updatingCategory = ref<MenuCategoryType | null>(null)
const {
  filter: filterCategory,
  sort: sortCategory,
  pager: pagerCategory,
  menuCategoryListRef,
  onLoad: onLoadCategory,
  onCreate: onCreateCategory,
  onUpdate: onUpdateCategory,
  onRemove: onDeleteCategory,
  onUpdatePositions: onUpdatePositionsCategory,
  loading: loadingCategory,
} = useMenuCategoryListActions(customerId)

filterCategory.value = { menuId }
sortCategory.value = { position: 1 }
pagerCategory.value = { page: 1, limit: CATEGORIES_LIMIT }

const menuCategoryItems: MenuItem[] = [
  {
    title: 'メニューカテゴリ追加',
    value: 'addMenuCategory',
    props: { prependIcon: 'mdi-plus' },
  },
  { type: 'divider' },
  {
    title: 'メニューカテゴリ並び替え',
    value: 'orderMenuCategory',
    props: { prependIcon: 'mdi-swap-vertical' },
  },
]
const onSelectMenuCategory = (value: number | string) => {
  switch (value) {
    case 'addMenuCategory':
      updatingCategory.value = null
      editCategoryModal.value = true
      break
    case 'orderMenuCategory':
      editCategoryPositionModal.value = true
      break
  }
}

/**
 * menu detail list
 */
const editDetailModal = ref(false)
const updatingDetail = ref<MenuDetailType | null>(null)
const targetCategory = ref<MenuCategoryType | null>(null)
const {
  filter: filterDetail,
  sort: sortDetail,
  pager: pagerDetail,
  menuDetailListRef,
  onLoad: onLoadDetail,
  onCreate: createDetail,
  onUpdate: updateDetail,
  onRemove: onDeleteDetail,
  onUpdatePositions: updatePositionsDetail,
  loading: loadingMenuDetailList,
} = useMenuDetailListActions(customerId)

const detailListByCategory = (categoryId: string) =>
  menuDetailListRef.value?.filter((d) => categoryId === d.categoryId) ?? []

const onCreateDetail = async (menuDetail: MenuDetailForm) => {
  if (!targetCategory.value) {
    return
  }
  await createDetail(menuId, targetCategory.value.id, menuDetail)
}
const onUpdateDetail = async ({
  id,
  formData,
}: {
  id: string
  formData: MenuDetailForm
}) => {
  if (!targetCategory.value) {
    return
  }
  await updateDetail({
    id,
    menuId,
    categoryId: targetCategory.value.id,
    formData,
  })
}
const onUpdatePositionsDetail = async (
  menuDetails: MenuDetailType[],
  category: MenuCategoryType
) => {
  await updatePositionsDetail(menuDetails, category.id)
}

filterDetail.value = { menuId: menuId }
sortDetail.value = { position: 1 }
pagerDetail.value = { page: 1, limit: DETAILS_LINIT }

const loading = computed(
  () =>
    loadingMenu.value || loadingCategory.value || loadingMenuDetailList.value
)
await Promise.all([onLoadMenu(menuId), onLoadCategory(), onLoadDetail()])
</script>

<template>
  <CommonContentWrap :loading="loading">
    <div class="menu-detail-screen">
      <template v-if="canEdit">
        <div class="g-block-lg">
          <div v-if="menuRef" class="menu-screen-actions">
            <BaseActivator
              v-model:modal="removeMenuModal"
              activator-text="ページ削除"
              activator-icon="mdi-delete"
              activator-size="small"
              activator-color="error"
            />
            <BaseActivator
              v-model:modal="editCategoryModal"
              activator-text="メニューカテゴリ追加"
              activator-icon="mdi-plus"
              activator-size="small"
              activator-color="info"
              @update:modal="updatingCategory = null"
            />
            <BaseActivator
              v-model:modal="editCategoryPositionModal"
              activator-text="メニューカテゴリ並び替え"
              activator-icon="mdi-arrow-up-down"
              activator-size="small"
              activator-color="info"
            />
          </div>
        </div>
        <div class="g-block-sm">
          <div v-if="menuRef" class="menu-screen-actions">
            <BaseActivator
              v-model:modal="removeMenuModal"
              activator-text="ページ削除"
              activator-icon="mdi-delete"
              activator-size="small"
              activator-color="error"
            />
            <BaseDropdown
              :items="menuCategoryItems"
              location="bottom end"
              @select="onSelectMenuCategory"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="info"
                  prepend-icon="mdi-chevron-down"
                  size="small"
                >
                  メニューカテゴリ操作
                </v-btn>
              </template>
            </BaseDropdown>
          </div>
        </div>
      </template>

      <div class="menu-detail-screen-container g-theme-contents-menu-detail">
        <template v-if="menuRef">
          <div class="menu-detail-screen-header">
            <h3 class="g-theme-contents-menu-title">{{ menuRef.title }}</h3>
          </div>
          <CommonContentPreNextNagivation
            v-if="preUrl?.length || nextUrl?.length"
            :pre-url="preUrl"
            :next-url="nextUrl"
            class="pre-next-navi"
          />
          <div v-else><br /></div>

          <div class="menu-detail-screen-body">
            <div
              v-for="category in menuCategoryListRef ?? []"
              :key="category.id"
              class="menu-category g-theme-contents-menu-category"
            >
              <CommonContentCardTitle :title="category.category" keep-center />

              <template v-if="canEdit">
                <div class="menu-category-actions">
                  <BaseActivator
                    v-model:modal="editDetailModal"
                    activator-text="メニュー項目追加"
                    activator-icon="mdi-plus"
                    activator-size="small"
                    activator-color="info"
                    @update:modal="
                      ((updatingDetail = null), (targetCategory = category))
                    "
                  />
                </div>
                <CommonContentGridRowDraggable
                  :contents="detailListByCategory(category.id)"
                  group="menuDetail"
                  dense
                  guide-line
                  @update="onUpdatePositionsDetail($event, category)"
                >
                  <template #default="{ content }">
                    <div class="menu-detail-container">
                      <PublishMenuDetailsItemGridRow :item="content" />
                      <CommonContentEditActivator
                        v-model:modal="editDetailModal"
                        activator-size="x-small"
                        is-update
                        class="edit-detail-activator"
                        @update:modal="
                          ((updatingDetail = content),
                          (targetCategory = category))
                        "
                      />
                    </div>
                  </template>
                </CommonContentGridRowDraggable>
                <div class="edit-category-activator">
                  <CommonContentEditActivator
                    v-model:modal="editCategoryModal"
                    activator-size="default"
                    is-update
                    @update:modal="updatingCategory = category"
                  />
                </div>
              </template>
              <template v-else>
                <CommonContentGridRow
                  :contents="detailListByCategory(category.id)"
                  dense
                >
                  <template #default="{ content }">
                    <div class="menu-detail-container">
                      <PublishMenuDetailsItemGridRow :item="content" />
                    </div>
                  </template>
                </CommonContentGridRow>
              </template>
            </div>
            <div
              v-if="
                menuCategoryListRef?.length > 2 &&
                menuCategoryListRef?.length % 2 === 1
              "
              class="menu-category-dummy"
            />
          </div>
          <CommonContentPreNextNagivation
            v-if="
              menuCategoryListRef.length && (preUrl?.length || nextUrl?.length)
            "
            :pre-url="preUrl"
            :next-url="nextUrl"
            class="pre-next-navi"
          />
          <div v-else><br /></div>
        </template>
        <div v-else class="no-items">
          <p>データがありません</p>
          <p class="mt-4">
            <nuxt-link :to="{ name: 'index' }">HOMEに戻る</nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </CommonContentWrap>
  <BaseConfirm
    v-if="menuRef"
    v-model:comfirm="removeMenuModal"
    message="本当に削除しますか？"
    exec-text="削除する"
    @cancel="removeMenuModal = false"
    @confirm="onRemoveMenu(menuRef.id)"
  />
  <ManageContentMenuCategory
    v-model:modal="editCategoryModal"
    :menu-category-data="updatingCategory"
    @create="onCreateCategory(menuId, $event)"
    @update="onUpdateCategory({ menuId, ...$event })"
    @remove="onDeleteCategory"
  />
  <ManageContentMenuDetail
    v-model:modal="editDetailModal"
    :menu-detail-data="updatingDetail"
    @create="onCreateDetail"
    @update="onUpdateDetail"
    @remove="onDeleteDetail"
  />
  <ManageContentMenuCategoryPositionSetting
    v-model:modal="editCategoryPositionModal"
    :menu-categories="menuCategoryListRef"
    @update="onUpdatePositionsCategory"
  />
</template>

<style lang="scss" scoped>
.menu-detail-screen {
  .menu-screen-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .menu-detail-screen-container {
    padding: 2rem 0 3rem;

    .pre-next-navi {
      margin: -1rem 1rem 0;
    }

    .menu-detail-screen-header {
      h3 {
        width: fit-content;
        margin: 0 auto;
        padding: 0 3rem;
      }
    }

    .menu-detail-screen-body {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
      width: 96%;
      max-width: 1500px;
      margin: 2.5rem auto 0;

      .menu-category {
        position: relative;
        width: 90%;
        max-width: 700px;
        padding: 0 0 4.5rem;

        .edit-category-activator {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
        }

        .menu-category-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .menu-detail-container {
          position: relative;

          .edit-detail-activator {
            position: absolute;
            top: 0.25rem;
            left: 4%;
          }
        }
      }

      .menu-category-dummy {
        width: 90%;
        max-width: 700px;
      }
    }
  }

  .no-items {
    p {
      text-align: center;
      font-weight: bold;
      color: $accent;
    }
  }
}
</style>
