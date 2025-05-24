import type { NewsType, NewsForm, NewsCategory } from '@/types/content'
import type { NewsGetApi, NewsSaveApi } from '@/types/API/content-api'

const apiKind = 'newses'
export const getNewsKind = () => apiKind

const useNewsConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  // category が元々 string だったので、元データを取り扱えるようにする
  const isCategoryString = (
    category: NewsCategory | string
  ): category is string => typeof category === 'string'

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
          // category が元々 string だったので、元データを取り扱えるようにする
          category: isCategoryString(apiData.category)
            ? {
                name: apiData.category,
                // name: 'aaaaあいあいあいあいあ',
                color: '#EF3038',
              }
            : apiData.category,
          publishOn: apiData.publishOn,
          body: apiData.body ?? '',
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
    category: {
      name: formData.categoryName,
      color: formData.categoryColor,
    },
    publishOn: formData.publishOn ?? localDate(),
    body: formData.body ?? '',
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
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
