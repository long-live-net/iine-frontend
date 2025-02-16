<script setup lang="ts">
import type {
  MenuCategoryType,
  MenuDetailType,
  MenuDetailForm,
} from '@/types/content'

const CATEGORIES_LIMIT = 32
const DETAILS_LINIT = 128

const { customerId } = useCustomer()
const { domidPrefix } = useCustomerSetting()

const router = useRouter()
const route = useRoute()
const menuId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const { canEdit } = useCustomerPageContext()

/**
 * Menu データ
 */
const editMenuModal = ref(false)
const {
  menuRef,
  menuPreNextIdRefRef,
  loading: loadingMenu,
  onLoad: onLoadMenu,
  onRemove: removeMenu,
} = useMenuActions(customerId)

const onRemoveMenu = async (id: string) => {
  await removeMenu(id)
  router.push(`/#${domidPrefix}-menu`)
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
  onRemove: removeDetail,
  onUpdatePositions: onUpdatePositionsDetail,
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
    <CommonContentSlidableNavigation :pre-url="preUrl" :next-url="nextUrl">
      <div class="menu-detail">
        <div v-if="canEdit" class="add-category-action">
          <BaseActivator
            v-if="menuRef"
            v-model:modal="editMenuModal"
            activator-text="ページ削除"
            activator-icon="mdi-delete"
            activator-size="default"
            activator-color="error"
          />
          <CommonContentEditActivator
            v-model:modal="editCategoryModal"
            activator-label="メニューカテゴリー追加"
            activator-size="default"
            @update:modal="updatingCategory = null"
          />
        </div>
        <PublishHomeType1SectionTitle :title="menuRef?.title ?? ''" />
        <div class="menu-category-conteiner">
          <div v-for="category in menuCategoryListRef ?? []" :key="category.id">
            <CommonContentPreNextNagivation
              :pre-url="preUrl"
              :next-url="nextUrl"
              class="pre-next-navi"
            />
            <CommonContentCard>
              <div class="menu-category">
                <CommonContentCardTitle
                  :title="category.category"
                  keep-center
                />
                <CommonContentGridRow
                  :contents="detailListByCategory(category.id)"
                  dense
                >
                  <template #default="{ content }">
                    <div class="menu-detail">
                      <PublishMenuDetailsItemGridRow
                        :item="content"
                        @select="() => {}"
                      />
                      <CommonContentEditActivator
                        v-if="canEdit"
                        v-model:modal="editDetailModal"
                        activator-size="x-small"
                        is-update
                        class="menu-detail__update_activator"
                        @update:modal="
                          ((updatingDetail = content),
                          (targetCategory = category))
                        "
                      />
                    </div>
                  </template>
                </CommonContentGridRow>
                <div v-if="canEdit" class="edit-category-activator">
                  <CommonContentEditActivator
                    v-model:modal="editCategoryModal"
                    activator-size="default"
                    is-update
                    @update:modal="updatingCategory = category"
                  />
                </div>
                <div v-if="canEdit" class="edit-detail-activator">
                  <CommonContentEditActivator
                    v-model:modal="editDetailModal"
                    activator-label="メニュー追加"
                    activator-size="default"
                    @update:modal="
                      ((updatingDetail = null), (targetCategory = category))
                    "
                  />
                </div>
              </div>
            </CommonContentCard>
          </div>
        </div>
      </div>
    </CommonContentSlidableNavigation>
  </CommonContentWrap>
  <BaseConfirm
    v-if="menuRef"
    v-model:comfirm="editMenuModal"
    message="本当に削除しますか？"
    exec-text="削除する"
    @cancel="editMenuModal = false"
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
    @remove="onDeleteCategory"
  />
</template>

<style lang="scss" scoped>
:deep(h3.section-title) {
  margin-bottom: 0;
}

.menu-detail {
  .add-category-action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .menu-category-conteiner {
    display: flex;
    flex-direction: column;

    .pre-next-navi {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    div:first-child {
      .pre-next-navi {
        margin-top: 0;
      }
    }

    .menu-category {
      position: relative;
      padding-bottom: 2.5rem;

      .menu-detail {
        position: relative;
        &__update_activator {
          position: absolute;
          top: 0.5rem;
          left: 0.75rem;
        }
      }

      .edit-category-activator {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
      }

      .edit-detail-activator {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
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
