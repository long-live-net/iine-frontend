import type { MenuImageForm, MenuImageType } from '@/types/content'
import type { MenuImageGetApi, MenuImageSaveApi } from '@/types/API/content-api'

const apiKind = 'menu-images'
export const getMenuImageKind = () => apiKind

const useMenuImageConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (
    apiData?: MenuImageGetApi | null
  ): MenuImageType | null =>
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
          menuImage: {
            name: apiData.menuImage.name,
            type: apiData.menuImage.type,
            url: apiData.menuImage.url,
          },
        }
      : null

  const formToSaveapi = (formData: MenuImageForm): MenuImageSaveApi => ({
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
    menuImage: {
      url: formData.menuImageUrl,
      name: formData.menuImageName,
      type: formData.menuImageType,
    },
  })

  return { apiToContent, formToSaveapi }
}

/**
 * menuImage list API アクションサービス
 * @param customerId
 */
export const useMenuImageListActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useMenuImageConverters(customerId)
  const {
    filter,
    sort,
    pager,
    listRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  } = useContentListActions<
    MenuImageType,
    MenuImageForm,
    MenuImageGetApi,
    MenuImageSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    contentTitle,
    filter,
    sort,
    pager,
    menuImageListRef: listRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}
