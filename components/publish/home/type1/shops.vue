<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'
import type {
  ShopCategoryType,
  ShopType,
  ContentEditMode,
} from '@/types/content'

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const CATEGORIES_LIMIT = 8 // category は 8 個までに制限
const SHOPS_LINIT = 128 // 店舗は 128 個までに制限

/**
 * shop category list
 */
const currentTabCategoryId = ref<string>('')
const editCategoryModal = ref(false)
const updatingCategory = ref<ShopCategoryType | null>(null)
const editModeCategory = ref<ContentEditMode>('update')
const editCategoryPositionModal = ref(false)
const {
  contentTitle: contentTitleCategory,
  filter: fIlterCategory,
  sort: sortCategory,
  pager: pagerCategory,
  shopCategoryListRef: categoryListRef,
  onLoad: onLoadCategoryList,
  onCreate: onCreateCategory,
  onUpdate: onUpdateCategory,
  onRemove: onRemoveCategory,
  onUpdatePositions: onUpdatePositionsCategory,
  loading: loadingCategoryList,
} = useShopCategoryListActions(customerId)
fIlterCategory.value = {}
sortCategory.value = { position: 1 }
pagerCategory.value = { page: 1, limit: CATEGORIES_LIMIT }

/**
 * shop list
 */
const editShopModal = ref(false)
const updatingShop = ref<ShopType | null>(null)
const editModeShop = ref<ContentEditMode>('update')
const {
  contentTitle: contentTitleShop,
  filter: filterShop,
  sort: sortShop,
  pager: pagerShop,
  shopListRef,
  onLoad: onLoadShopList,
  onCreateShop,
  onUpdateShop,
  onRemove: onRemoveShop,
  onUpdatePositions,
  loading: loadingShopList,
} = useShopListActions(customerId)

const onEditTargetShop = ({
  item,
  mode,
}: {
  item: ShopType | null
  mode: ContentEditMode
}) => {
  updatingShop.value = item ?? null
  editModeShop.value = mode
}

filterShop.value = {}
sortShop.value = { categoryId: 1, position: 1 }
pagerShop.value = { page: 1, limit: SHOPS_LINIT }

const loading = computed(
  () => loadingCategoryList.value || loadingShopList.value
)
await Promise.all([onLoadCategoryList(), onLoadShopList()])

/**
 * Shop Category Tabs
 */
const shopListByCategory = computed(
  () =>
    shopListRef.value?.filter(
      (s) => currentTabCategoryId.value === s.categoryId
    ) ?? []
)
const uiCategoryItems = computed<UiTabItem[]>(() =>
  categoryListRef.value.map((c) => ({
    key: c.id,
    label: c.category,
    value: c.id,
  }))
)
const onClickTabEdit = (tabItem: UiTabItem) => {
  updatingCategory.value =
    categoryListRef.value.find((c) => c.id === tabItem.value) ?? null
  editModeCategory.value = 'update'
  editCategoryModal.value = true
}
const onClickTabDelete = (tabItem: UiTabItem) => {
  updatingCategory.value =
    categoryListRef.value.find((c) => c.id === tabItem.value) ?? null
  editModeCategory.value = 'delete'
  editCategoryModal.value = true
}

// Note. nuxt server side では watch しないので
// load した後に immediate をつけて watch する必要がある
watch(
  categoryListRef,
  () => {
    if (categoryListRef.value.length) {
      currentTabCategoryId.value = categoryListRef.value[0].id
    } else {
      currentTabCategoryId.value = ''
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <CommonContentWrap :loading="loading" class="home-content-shops">
    <div v-if="canEdit" class="shop-category-actions">
      <BaseActivator
        v-model:modal="editCategoryModal"
        activator-text="カテゴリ追加"
        activator-icon="mdi-plus"
        activator-size="small"
        activator-color="info"
        @update:modal="((updatingCategory = null), (editModeCategory = 'new'))"
      />
      <BaseActivator
        v-model:modal="editCategoryPositionModal"
        activator-text="カテゴリ並替え"
        activator-icon="mdi-sort-reverse-variant"
        activator-size="small"
        activator-color="info"
      />
    </div>
    <CommonContentCard2>
      <CommonContentTabs
        v-if="categoryListRef.length"
        v-model:tab="currentTabCategoryId"
        :tab-items="uiCategoryItems"
        :can-edit="canEdit"
        show-bottom-navi
        content-title="カテゴリ"
        @edit="onClickTabEdit"
        @delete="onClickTabDelete"
      >
        <PublishContentGridTable
          v-model:modal="editShopModal"
          :items="shopListByCategory"
          :content-title="contentTitleShop"
          :can-edit="canEdit"
          narrow
          class="shop-items-grid-table"
          @edit-target="onEditTargetShop"
          @update-positions="onUpdatePositions"
        >
          <template #default="{ content }">
            <PublishContentGridItem
              :item="content"
              :see-detail-path="`/shops/${content.id}`"
              item-shape="circle"
            />
          </template>
        </PublishContentGridTable>
      </CommonContentTabs>
      <div v-else class="no-items">
        <p>{{ contentTitleCategory }}がありません</p>
        <div class="d-flex align-center">
          <CommonContentEditActivator
            v-model:modal="editCategoryModal"
            :content-title="contentTitleCategory"
            edit-mode="new"
            @update:modal="() => {}"
          />
          <p class="ml-2">
            このボタンから{{ contentTitleCategory }}を登録してください。
          </p>
        </div>
      </div>
    </CommonContentCard2>
  </CommonContentWrap>
  <ManageContentShopCategory
    v-model:modal="editCategoryModal"
    :content-title="contentTitleCategory"
    :edit-mode="editModeCategory"
    :shop-category-data="updatingCategory"
    @create="onCreateCategory"
    @update="onUpdateCategory"
    @remove="onRemoveCategory"
  />
  <ManageContentShop
    v-model:modal="editShopModal"
    :content-title="contentTitleShop"
    :edit-mode="editModeShop"
    :shop-data="updatingShop"
    :current-category-id="currentTabCategoryId"
    :category-select-items="uiCategoryItems"
    @create="onCreateShop"
    @update="onUpdateShop"
    @remove="onRemoveShop"
  />
  <ManageContentShopCategoryPositionSetting
    v-model:modal="editCategoryPositionModal"
    :shop-categories="categoryListRef"
    @update="onUpdatePositionsCategory"
  />
</template>

<style lang="scss" scoped>
.home-content-shops {
  .shop-category-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 1.25rem 0;
  }

  .shop-items-grid-table {
    padding: 3rem 0;
  }

  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    row-gap: 1rem;

    p {
      font-weight: bold;
      color: var(--warning-color);
    }
  }
}
</style>
