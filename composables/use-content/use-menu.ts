import type { MenuForm, MenuType } from '@/types/content'
import type { MenuGetApi, MenuSaveApi } from '@/types/API/content-api'

const apiKind = 'menus'
export const getMenuKind = () => apiKind

const MAXIMUM_LIMIT_OF_CONTENTS = 36 // Menu の登録上限数
export const getMenuMaximumLimit = () => MAXIMUM_LIMIT_OF_CONTENTS

const useMenuConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: MenuGetApi | null): MenuType | null =>
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
        }
      : null

  const formToSaveapi = (formData: MenuForm): MenuSaveApi => ({
    customerId: customerId.value ?? '',
    title: formData.title,
    titleSettings: { ...formData.titleSettings },
    caption: formData.caption,
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
 * menu list API アクションサービス
 * @param customerId
 */
export const useMenuListActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useMenuConverters(customerId)
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
  } = useContentListActions<MenuType, MenuForm, MenuGetApi, MenuSaveApi>(
    apiKind,
    contentTitle,
    customerId,
    apiToContent,
    formToSaveapi
  )

  const isMaximumLimit = computed(
    () => (totalRef.value ?? 0) >= MAXIMUM_LIMIT_OF_CONTENTS
  )

  return {
    contentTitle,
    filter,
    sort,
    pager,
    menuListRef: listRef,
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
 * menu detail API アクションサービス
 * @param customerId
 */
export const useMenuActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useMenuConverters(customerId)
  const {
    contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  } = useContentActions<MenuType, MenuForm, MenuGetApi, MenuSaveApi>(
    apiKind,
    contentTitle,
    customerId,
    apiToContent,
    formToSaveapi
  )

  return {
    contentTitle,
    menuRef: contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
