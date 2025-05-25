import type { ShopCategoryForm, ShopCategoryType } from '@/types/content'
import type {
  ShopCategoryGetApi,
  ShopCategorySaveApi,
} from '@/types/API/content-api'

const apiKind = 'shop-categories'
export const getShopCategoryKind = () => apiKind

const MAXIMUM_LIMIT_OF_CONTENTS = 20 // Shop Category の登録上限数
export const getShopCategoryMaximumLimit = () => MAXIMUM_LIMIT_OF_CONTENTS

const useShopCategoryConverters = (customerId: Ref<string | null>) => {
  const apiToContent = (
    apiData?: ShopCategoryGetApi | null
  ): ShopCategoryType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          category: apiData.category,
          position: apiData.position,
        }
      : null

  const formToSaveapi = (formData: ShopCategoryForm): ShopCategorySaveApi => ({
    customerId: customerId.value ?? '',
    category: formData.category,
    position: formData.position,
  })

  return {
    apiToContent,
    formToSaveapi,
  }
}

export const useShopCategoryListActions = (customerId: Ref<string | null>) => {
  const baseTitle = useGetMenuTitle('shops') ?? 'お店'
  const contentTitle = `${baseTitle}カテゴリ`
  const { apiToContent, formToSaveapi } = useShopCategoryConverters(customerId)
  const {
    filter,
    sort,
    pager,
    listRef,
    totalRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  } = useContentCategoryListActions<
    ShopCategoryType,
    ShopCategoryForm,
    ShopCategoryGetApi,
    ShopCategorySaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  const isMaximumLimit = computed(
    () => (totalRef.value ?? 0) >= MAXIMUM_LIMIT_OF_CONTENTS
  )

  return {
    contentTitle,
    filter,
    sort,
    pager,
    shopCategoryListRef: listRef,
    shopCategoryTotalRef: totalRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
    isMaximumLimit,
  }
}
