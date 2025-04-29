import type { ShopType, ShopForm } from '@/types/content'
import type { ShopGetApi, ShopSaveApi } from '@/types/API/content-api'

const apiKind = 'shops'
export const getShopKind = () => apiKind

const useShopConverters = (customerId: Ref<string | null>) => {
  const currentCategoryId = ref<string>('')
  const setCurrentCategoryId = (categoryId: string) => {
    currentCategoryId.value = categoryId
  }

  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: ShopGetApi | null): ShopType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          categoryId: apiData.categoryId,
          title: apiData.title,
          titleSettings: {
            ...getDefaultTitleSettings(),
            ...(apiData.titleSettings ? apiData.titleSettings : {}),
          },
          caption: apiData.caption,
          body: apiData.body,
          image: {
            url: apiData.image.url,
            name: apiData.image.name ?? 'dummy_name',
            type:
              apiData.image.type ??
              getFileTypeByExtention(getFileExtension(apiData.image.url)),
          },
          imageSettings: {
            ...getDefaultImageSettings(),
            ...(apiData.imageSettings ? apiData.imageSettings : {}),
          },
          position: apiData.position,
        }
      : null

  const formToSaveapi = (formData: ShopForm): ShopSaveApi => ({
    customerId: customerId.value ?? '',
    categoryId: currentCategoryId.value,
    title: formData.title,
    titleSettings: { ...formData.titleSettings },
    caption: formData.caption,
    body: formData.body,
    position: formData.position,
    image: {
      url: formData.image,
      name: formData.imageName,
      type: formData.imageType,
    },
    imageSettings: { ...(formData.imageSettings ?? getDefaultImageSettings()) },
  })

  return {
    setCurrentCategoryId,
    apiToContent,
    formToSaveapi,
  }
}

/**
 * shop list API アクションサービス
 * @param customerId
 */
export const useShopListActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { setCurrentCategoryId, apiToContent, formToSaveapi } =
    useShopConverters(customerId)
  const {
    filter,
    sort,
    pager,
    listRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  } = useContentListActions<ShopType, ShopForm, ShopGetApi, ShopSaveApi>(
    apiKind,
    contentTitle,
    customerId,
    apiToContent,
    formToSaveapi
  )

  const onCreateShop = async (categoryId: string, formData: ShopForm) => {
    setCurrentCategoryId(categoryId)
    await onCreate(formData)
  }

  const onUpdateShop = async (
    id: string,
    categoryId: string,
    formData: ShopForm
  ) => {
    setCurrentCategoryId(categoryId)
    await onUpdate({ id, formData })
  }

  return {
    contentTitle,
    filter,
    sort,
    pager,
    shopListRef: listRef,
    onLoad,
    onGetList,
    onCreateShop,
    onUpdateShop,
    onRemove,
    onUpdatePositions,
    loading,
  }
}

/**
 * shop detail API アクションサービス
 * @param customerId
 */
export const useShopActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { setCurrentCategoryId, apiToContent, formToSaveapi } =
    useShopConverters(customerId)
  const {
    contentRef,
    contentPreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  } = useContentActions<ShopType, ShopForm, ShopGetApi, ShopSaveApi>(
    apiKind,
    contentTitle,
    customerId,
    apiToContent,
    formToSaveapi
  )

  const onCreateShop = async (categoryId: string, formData: ShopForm) => {
    setCurrentCategoryId(categoryId)
    await onCreate(formData)
  }

  const onUpdateShop = async (
    id: string,
    categoryId: string,
    formData: ShopForm
  ) => {
    setCurrentCategoryId(categoryId)
    await onUpdate({ id, formData })
  }

  return {
    contentTitle,
    shopRef: contentRef,
    shopPreNextIdRefRef: contentPreNextIdRefRef,
    loading,
    onLoad,
    onCreateShop,
    onUpdateShop,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
