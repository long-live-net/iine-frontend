<script setup lang="ts">
import type {
  MenuCategoryType,
  MenuDetailType,
  MenuDetailForm,
  ContentEditMode,
} from '@/types/content'
import type { MenuItem } from '@/components/base/dropdown.vue'
const emit = defineEmits<{ 'update:data': [] }>()

const CATEGORIES_LIMIT = 32
const DETAILS_LINIT = 128

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const { domidPrefix } = useCustomerSetting()

const router = useRouter()
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
  loading: loadingMenu,
  onLoad: onLoadMenu,
  onRemove: removeMenu,
} = useMenuActions(customerId)

const onRemoveMenu = async (id: string) => {
  await removeMenu(id)
  emit('update:data')
  removeMenuModal.value = false

  await router.push({
    name: 'index',
    hash: `#${domidPrefix}-menu`,
  })
}

/**
 * Menu Category データ
 */
const editCategoryModal = ref(false)
const editCategoryPositionModal = ref(false)
const updatingCategory = ref<MenuCategoryType | null>(null)
const editModeCategory = ref<ContentEditMode>('update')
const {
  filter: filterCategory,
  sort: sortCategory,
  pager: pagerCategory,
  menuCategoryListRef,
  onLoad: onLoadCategory,
  onCreateCategory,
  onUpdateCategory,
  onRemove: onDeleteCategory,
  onUpdatePositions: onUpdatePositionsCategory,
  loading: loadingCategory,
  isMaximumLimit: isMaximumLimitCategory,
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
    title: 'メニューカテゴリ並替え',
    value: 'orderMenuCategory',
    props: { prependIcon: 'mdi-sort-reverse-variant' },
  },
]
const onSelectMenuCategory = (value: number | string) => {
  switch (value) {
    case 'addMenuCategory':
      updatingCategory.value = null
      editCategoryModal.value = true
      editModeCategory.value = 'new'
      break
    case 'orderMenuCategory':
      editCategoryPositionModal.value = true
      break
  }
}
const onCreatingCategory = () => {
  updatingCategory.value = null
  if (isMaximumLimitCategory.value) {
    editModeCategory.value = 'maximumLimit'
  } else {
    editModeCategory.value = 'new'
  }
}

/**
 * menu detail list
 */
const editDetailModal = ref(false)
const updatingDetail = ref<MenuDetailType | null>(null)
const targetCategory = ref<MenuCategoryType | null>(null)
const editModeDetail = ref<ContentEditMode>('update')
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

filterDetail.value = { menuId }
sortDetail.value = { position: 1 }
pagerDetail.value = { page: 1, limit: DETAILS_LINIT }

const loading = computed(
  () =>
    loadingMenu.value || loadingCategory.value || loadingMenuDetailList.value
)
await onLoadMenu(menuId)
await Promise.all([onLoadCategory(), onLoadDetail()])
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
              activator-color="grey-darken-1"
            />
            <BaseActivator
              v-model:modal="editCategoryModal"
              activator-text="メニューカテゴリ追加"
              activator-icon="mdi-plus"
              activator-size="small"
              activator-color="info"
              @update:modal="onCreatingCategory"
            />
            <BaseActivator
              v-model:modal="editCategoryPositionModal"
              activator-text="メニューカテゴリ並替え"
              activator-icon="mdi-sort-reverse-variant"
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
              activator-color="grey-darken-1"
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
          <div class="menu-detail-screen-body">
            <div
              v-for="category in menuCategoryListRef ?? []"
              :key="category.id"
              class="menu-category g-theme-contents-menu-category"
            >
              <CommonContentCardTitle :title="category.category" />

              <template v-if="canEdit">
                <div class="menu-category-actions">
                  <BaseActivator
                    v-model:modal="editDetailModal"
                    activator-text="メニュー項目追加"
                    activator-icon="mdi-plus"
                    activator-size="small"
                    activator-color="info"
                    @update:modal="
                      ((editModeDetail = 'new'),
                      (updatingDetail = null),
                      (targetCategory = category))
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
                    <div
                      class="menu-detail-container"
                      :class="{ 'menu-detail-can-edit': canEdit }"
                    >
                      <PublishMenuDetailsItemGridRow :item="content" />
                      <div class="edit-detail-activator">
                        <div class="activators">
                          <CommonContentEditActivator
                            v-model:modal="editDetailModal"
                            content-title="メニュー項目"
                            edit-mode="update"
                            activator-size="x-small"
                            @update:modal="
                              ((editModeDetail = 'update'),
                              (updatingDetail = content),
                              (targetCategory = category))
                            "
                          />
                          <CommonContentEditActivator
                            v-model:modal="editDetailModal"
                            content-title="メニュー項目"
                            edit-mode="delete"
                            activator-size="x-small"
                            @update:modal="
                              ((editModeDetail = 'delete'),
                              (updatingDetail = content),
                              (targetCategory = category))
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </CommonContentGridRowDraggable>
                <div class="edit-category-activator">
                  <div class="activators">
                    <CommonContentEditActivator
                      v-model:modal="editCategoryModal"
                      content-title="メニューカテゴリ"
                      edit-mode="update"
                      activator-size="small"
                      @update:modal="
                        ((updatingCategory = category),
                        (editModeCategory = 'update'))
                      "
                    />
                    <CommonContentEditActivator
                      v-model:modal="editCategoryModal"
                      edit-mode="delete"
                      content-title="メニューカテゴリ"
                      activator-size="small"
                      @update:modal="
                        ((updatingCategory = category),
                        (editModeCategory = 'delete'))
                      "
                    />
                  </div>
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
  <CommonContentDeleteConfirm
    v-if="menuRef"
    v-model:comfirm="removeMenuModal"
    content-title="メニュー"
    @cancel="removeMenuModal = false"
    @confirm="onRemoveMenu(menuRef.id)"
  />
  <ManageContentMenuCategory
    v-model:modal="editCategoryModal"
    content-title="メニューカテゴリ"
    :edit-mode="editModeCategory"
    :menu-category-data="updatingCategory"
    @create="onCreateCategory(menuId, $event)"
    @update="onUpdateCategory({ menuId, ...$event })"
    @remove="onDeleteCategory"
  />
  <ManageContentMenuDetail
    v-model:modal="editDetailModal"
    content-title="メニュー項目"
    :edit-mode="editModeDetail"
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
    margin-bottom: 1.5rem;
  }

  .menu-detail-screen-container {
    padding: 4rem 0;

    .menu-detail-screen-body {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      width: 96%;
      max-width: 1500px;
      margin: 0 auto;

      .menu-category {
        position: relative;
        width: 90%;
        max-width: 680px;
        padding: 0 0 4rem;

        .edit-category-activator {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;

          @media only screen and (max-width: $grid-breakpoint-md) {
            top: 3.5rem;
            left: 2rem;
          }

          .activators {
            display: flex;
            column-gap: 0.5rem;
          }
        }

        .menu-category-actions {
          display: flex;
          justify-content: end;
          align-items: center;
          gap: 0.5rem;
          margin-right: 2rem;
          margin-bottom: 1rem;
        }

        .menu-detail-container {
          padding-left: 0;
        }

        .menu-detail-can-edit {
          position: relative;
          min-height: 7rem;
          padding-left: 2rem;

          .edit-detail-activator {
            position: absolute;
            top: -8px;
            left: -8px;

            .activators {
              display: flex;
              gap: 0.25rem;
            }
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
      color: var(--warning-color);
    }
  }
}
</style>
