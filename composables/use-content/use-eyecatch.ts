import type {
  EyecatchType,
  EyecatchForm,
  EyecatchTitleSettings,
} from '@/types/content'
import type { EyecatchGetApi, EyecatchSaveApi } from '@/types/API/content-api'

const apiKind = 'eyecatches'
export const getEyecatchKind = () => apiKind
export const getEyecatchDefaultTitleSettings = (): EyecatchTitleSettings => ({
  fontFamily: 'inherit',
  color: '#FFFFFF',
  bgColor: 'transparent',
  position: '50% 50%',
  positionSm: '50% 50%',
  align: 'left',
})

const useEyecatchConverters = (customerId: Ref<string | null>) => {
  const { getDefaultImageSettings } = useContentInit()

  const apiToContent = (
    apiData?: EyecatchGetApi | null
  ): EyecatchType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          subtitle: apiData.subtitle,
          titleSettings: {
            ...getEyecatchDefaultTitleSettings(),
            ...(apiData.titleSettings ? apiData.titleSettings : {}),
          },
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
        }
      : null

  const formToSaveapi = (formData: EyecatchForm): EyecatchSaveApi => ({
    customerId: customerId.value ?? '',
    title: formData.title,
    subtitle: formData.subtitle,
    titleSettings: { ...formData.titleSettings },
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
 * Eyecatch API アクションサービス
 * @param customerId
 */
export const useEyecatchActions = (customerId: Ref<string | null>) => {
  const contentTitle = 'トップ画像'
  const { apiToContent, formToSaveapi } = useEyecatchConverters(customerId)
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
    EyecatchType,
    EyecatchForm,
    EyecatchGetApi,
    EyecatchSaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  return {
    eyecatchRef: contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
