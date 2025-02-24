import type { ContactType, ContactForm } from '@/types/content'
import type { ContactGetApi, ContactSaveApi } from '@/types/API/content-api'

const apiKind = 'contacts'
export const getContactKind = () => apiKind

const useContactConverters = (customerId: Ref<string | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()

  const apiToContent = (apiData?: ContactGetApi | null): ContactType | null =>
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

  const formToSaveapi = (formData: ContactForm): ContactSaveApi => ({
    customerId: customerId.value ?? '',
    title: formData.title,
    subtitle: formData.subtitle,
    titleSettings: { ...formData.titleSettings },
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
 * Contact API アクションサービス
 * @param customerId
 */
export const useContactActions = (customerId: Ref<string | null>) => {
  const contentTitle = useGetMenuTitle(apiKind) ?? apiKind
  const { apiToContent, formToSaveapi } = useContactConverters(customerId)
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
    ContactType,
    ContactForm,
    ContactGetApi,
    ContactSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    contactRef: contentRef,
    contactPreNextIdRefRef: contentPreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
