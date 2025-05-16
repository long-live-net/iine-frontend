<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'
import type { ShopType, ShopForm, ContentEditMode } from '@/types/content'

const CATEGORIES_LIMIT = 8 // category は 8 個までに制限
const SHOPS_LINIT = 128 // 店舗は 128 個までに制限
const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()

const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const {
  contentTitle,
  shopRef,
  loading: loadingShop,
  onLoad,
  onUpdateShop,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useShopActions(customerId)
const editModal = ref(false)
const editMode = ref<ContentEditMode>('update')

const {
  contentTitle: contentTitleCategory,
  filter: fIlterCategory,
  sort: sortCategory,
  pager: pagerCategory,
  shopCategoryListRef: categoryListRef,
  onLoad: onLoadCategoryList,
  loading: loadingCategoryList,
} = useShopCategoryListActions(customerId)
fIlterCategory.value = {}
sortCategory.value = { position: 1 }
pagerCategory.value = { page: 1, limit: CATEGORIES_LIMIT }

const {
  contentTitle: contentTitleShop,
  filter: filterShop,
  sort: sortShop,
  pager: pagerShop,
  shopListRef,
  onLoad: onLoadShopList,
  onGetList: onGetShopList,
  loading: loadingShopList,
} = useShopListActions(customerId)

filterShop.value = {}
sortShop.value = { categoryId: 1, position: 1 }
pagerShop.value = { page: 1, limit: SHOPS_LINIT }

const loading = computed(
  () => loadingShop.value || loadingCategoryList.value || loadingShopList.value
)

await Promise.all([onLoad(contentId), onLoadCategoryList(), onLoadShopList()])

const currentTabCategoryId = ref<string>(shopRef.value?.categoryId ?? '')
watch(
  shopRef,
  () => {
    currentTabCategoryId.value = shopRef.value?.categoryId ?? ''
  },
  {
    immediate: true,
  }
)
const uiCategoryItems = computed<UiTabItem[]>(() =>
  categoryListRef.value.map((c) => ({
    key: c.id,
    label: c.category,
    value: c.id,
  }))
)
const shopListByCategory = computed<ShopType[]>(
  () =>
    shopListRef.value?.filter(
      (s) => currentTabCategoryId.value === s.categoryId
    ) ?? []
)
const allShops = computed<ShopType[]>(() =>
  categoryListRef.value.reduce<ShopType[]>((acc, category) => {
    const shops =
      shopListRef.value?.filter((s) => category.id === s.categoryId) ?? []
    return [...acc, ...shops]
  }, [])
)
const preUrl = computed<string | null>(() => {
  const curIndex = allShops.value.findIndex((s) => s.id === contentId)
  const preId = allShops.value[curIndex - 1]?.id
  return preId ? `/shops/${preId}` : null
})
const nextUrl = computed<string | null>(() => {
  const curIndex = allShops.value.findIndex((s) => s.id === contentId)
  const nextId = allShops.value[curIndex + 1]?.id
  return nextId ? `/shops/${nextId}` : null
})

const onUpdateData = async (params: { id: string; formData: ShopForm }) => {
  await onUpdateShop(params)
  onGetShopList()
}
const onRemoveData = async (id: string) => {
  await onRemove(id)
  onGetShopList()
}
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard>
      <PublishContentDetailItem
        v-model:modal="editModal"
        :item="shopRef"
        :content-title="contentTitle"
        :can-edit="canEdit"
        no-image-parallax
        @edit-mode="editMode = $event"
        @update-title-setting="onUpdateTitleSetting"
        @update-image-setting="onUpdateImageSetting"
      >
        <template #middlenavi>
          <CommonContentPreNextNagivation
            :pre-url="preUrl"
            :next-url="nextUrl"
          />
        </template>
      </PublishContentDetailItem>
    </CommonContentCard>
  </CommonContentWrap>
  <CommonContentWrap :loading="loading" class="shop-list-gap">
    <CommonContentCard2>
      <CommonContentTabs
        v-if="categoryListRef.length"
        v-model:tab="currentTabCategoryId"
        :tab-items="uiCategoryItems"
        :can-edit="false"
        :content-title="contentTitleCategory"
      >
        <PublishContentGridTable
          v-model:modal="editModal"
          :content-title="contentTitleShop"
          :items="shopListByCategory"
          :can-edit="false"
          class="pt-10 pb-12"
          small
        >
          <template #default="{ content }">
            <PublishContentGridItem
              :item="content"
              :see-detail-path="`/shops/${content.id}`"
              :is-current="content.id === contentId"
              item-shape="circle"
              no-caption
            />
          </template>
        </PublishContentGridTable>
      </CommonContentTabs>
    </CommonContentCard2>
  </CommonContentWrap>
  <ManageContentShop
    v-model:modal="editModal"
    :content-title="contentTitle"
    :edit-mode="editMode"
    :shop-data="shopRef"
    :current-category-id="currentTabCategoryId"
    :category-select-items="uiCategoryItems"
    @update="onUpdateData"
    @remove="onRemoveData"
  />
</template>

<style lang="scss" scoped>
.shop-list-gap {
  margin-top: 6rem;
}
</style>
