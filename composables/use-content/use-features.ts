import type { FeatureForm, FeatureType } from '@/types/content'
import type { FeatureGetApi, FeatureSaveApi } from '@/types/API/content-api'

const apiKind = 'features'
export const getFeatureKind = () => apiKind

const useFeatureConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: FeatureGetApi | null): FeatureType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
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

  const formToSaveapi = (formData: FeatureForm): FeatureSaveApi => ({
    customerId: customerId.value ?? '',
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

  return { apiToContent, formToSaveapi }
}

/**
 * feature list API アクションサービス
 * @param customerId
 */
export const useFeatureListActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useFeatureConverters(customerId)
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
  } = useContentListActions<
    FeatureType,
    FeatureForm,
    FeatureGetApi,
    FeatureSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    filter,
    sort,
    pager,
    featureListRef: listRef,
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
 * feature detail API アクションサービス
 * @param customerId
 */
export const useFeatureActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useFeatureConverters(customerId)
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
  } = useContentActions<
    FeatureType,
    FeatureForm,
    FeatureGetApi,
    FeatureSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    featureRef: contentRef,
    featurePreNextIdRefRef: contentPreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
