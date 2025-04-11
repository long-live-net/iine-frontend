import type { ProfileType, ProfileForm } from '@/types/content'
import type { ProfileGetApi, ProfileSaveApi } from '@/types/API/content-api'

const apiKind = 'profiles'
export const getProfileKind = () => apiKind

const useProfileConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: ProfileGetApi | null): ProfileType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          subtitle: apiData.subtitle,
          titleSettings: {
            ...getDefaultTitleSettings(),
            ...(apiData.titleSettings ? apiData.titleSettings : {}),
          },
          captionBody: apiData.captionBody,
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

  const formToSaveapi = (formData: ProfileForm): ProfileSaveApi => ({
    customerId: customerId.value ?? '',
    title: formData.title,
    subtitle: formData.subtitle,
    titleSettings: { ...formData.titleSettings },
    captionBody: formData.captionBody,
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
 * Profile API アクションサービス
 * @param customerId
 */
export const useProfileActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useProfileConverters(customerId)

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
    ProfileType,
    ProfileForm,
    ProfileGetApi,
    ProfileSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    contentTitle,
    profileRef: contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
