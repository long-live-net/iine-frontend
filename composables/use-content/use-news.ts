import type { NewsType, NewsForm } from '@/types/content'
import type { NewsGetApi, NewsSaveApi } from '@/types/API/content-api'

const apiKind = 'newses'
export const getNewsKind = () => apiKind

const useNewsConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: NewsGetApi | null): NewsType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          titleSettings: {
            ...getDefaultTitleSettings(),
            ...(apiData.titleSettings ? apiData.titleSettings : {}),
          },
          category: apiData.category,
          publishOn: apiData.publishOn,
          body: apiData.body,
          ...(apiData.image
            ? {
                image: {
                  url: apiData.image.url,
                  name: apiData.image.name ?? 'dummy_name',
                  type:
                    apiData.image.type ??
                    getFileTypeByExtention(getFileExtension(apiData.image.url)),
                },
              }
            : {}),
          ...(apiData.imageSettings
            ? {
                imageSettings: {
                  ...getDefaultImageSettings(),
                  ...apiData.imageSettings,
                },
              }
            : {}),
        }
      : null

  const formToSaveapi = (formData: NewsForm): NewsSaveApi => ({
    customerId: customerId.value ?? '',
    title: formData.title,
    titleSettings: { ...formData.titleSettings },
    category: formData.category ?? 'I',
    publishOn: formData.publishOn ?? localDate(),
    body: formData.body,
    ...(formData.image && formData.imageName && formData.imageType
      ? {
          image: {
            url: formData.image,
            name: formData.imageName,
            type: formData.imageType,
          },
          imageSettings: {
            ...getDefaultImageSettings(),
            ...(formData.imageSettings ? formData.imageSettings : {}),
          },
        }
      : {}),
  })

  return { apiToContent, formToSaveapi }
}

/**
 * news list API アクションサービス
 * @param customerId
 */
export const useNewsListActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useNewsConverters(customerId)
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
  } = useContentListActions<NewsType, NewsForm, NewsGetApi, NewsSaveApi>(
    apiKind,
    contentTitle,
    customerId,
    apiToContent,
    formToSaveapi
  )

  return {
    contentTitle,
    filter,
    sort,
    pager,
    newsListRef: listRef,
    newsTotalRef: totalRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}

/**
 * news API アクションサービス
 * @param customerId
 */
export const useNewsActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useNewsConverters(customerId)
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
  } = useContentActions<NewsType, NewsForm, NewsGetApi, NewsSaveApi>(
    apiKind,
    contentTitle,
    customerId,
    apiToContent,
    formToSaveapi
  )

  return {
    contentTitle,
    newsRef: contentRef,
    newsPreNextIdRefRef: contentPreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}

export const useNewsCategory = () => {
  const { customerSetting } = useCustomerSetting()

  const categoryItems = computed(
    () => customerSetting.value?.newsCategories ?? []
  )
  const category2BkColor = [
    '#2962FF',
    '#4CAF50',
    '#FFEA00',
    '#E53935',
    '#ECEFF1',
    '#AA00FF',
  ]
  const category2Color = ['white', 'white', 'black', 'white', 'black', 'white']

  const getCategory2BkColor = (category: string) => {
    const index = Math.abs(
      categoryItems.value.findIndex((c) => c === category) %
        category2BkColor.length
    )
    return category2BkColor[index]
  }

  const getCategory2Color = (category: string) => {
    const index = Math.abs(
      categoryItems.value.findIndex((c) => c === category) %
        category2Color.length
    )
    return category2Color[index]
  }

  return {
    categoryItems,
    getCategory2BkColor,
    getCategory2Color,
  }
}
