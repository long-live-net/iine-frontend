import type { ServiceType, ServiceForm } from '@/types/content'
import type { ServiceGetApi, ServiceSaveApi } from '@/types/API/content-api'

const apiKind = 'services'
export const getServiceKind = () => apiKind

const MAXIMUM_LIMIT_OF_CONTENTS = 36 // Service の登録上限数
export const getServiceMaximumLimit = () => MAXIMUM_LIMIT_OF_CONTENTS

const useServiceConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: ServiceGetApi | null): ServiceType | null =>
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

  const formToSaveapi = (formData: ServiceForm): ServiceSaveApi => ({
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
 * service list API アクションサービス
 * @param customerId
 */
export const useServiceListActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useServiceConverters(customerId)
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
  } = useContentListActions<
    ServiceType,
    ServiceForm,
    ServiceGetApi,
    ServiceSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  const isMaximumLimit = computed(
    () => (totalRef.value ?? 0) >= MAXIMUM_LIMIT_OF_CONTENTS
  )

  return {
    contentTitle,
    filter,
    sort,
    pager,
    serviceListRef: listRef,
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

/**
 * service detail API アクションサービス
 * @param customerId
 */
export const useServiceActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useServiceConverters(customerId)
  const {
    contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  } = useContentActions<
    ServiceType,
    ServiceForm,
    ServiceGetApi,
    ServiceSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    contentTitle,
    serviceRef: contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
