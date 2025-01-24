import type {
  InformationType,
  InformationForm,
  TitleSettings,
  ImageSettings,
} from '@/types/content'
import type {
  InformationGetApi,
  InformationSaveApi,
} from '@/types/API/content-api'

const apiKind = 'informations'
export const getInformationKind = () => apiKind

const useInformationContent = (customerId: Ref<number | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()
  const {
    loadData,
    get,
    setTitleSettings,
    setImageSettings,
    contentDataRef,
    loadingRef: readLoading,
  } = useContentRead<InformationGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<InformationSaveApi, InformationGetApi>(
    customerId,
    apiKind
  )

  const apitypeToInformationType = (
    apiData?: InformationGetApi | null
  ): InformationType | null =>
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

  const informationRef = computed<InformationType | null>(() =>
    apitypeToInformationType(contentDataRef.value)
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToInformationSaveApi = (
    formData: InformationForm
  ): InformationSaveApi => ({
    customerId: customerId.value ?? 0,
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

  const createInformation = async (
    formData: InformationForm
  ): Promise<InformationType | null> => {
    const inputData: InformationSaveApi = formToInformationSaveApi(formData)
    const data = await create(inputData)
    return apitypeToInformationType(data ?? null)
  }

  const updateInformation = async (
    contentId: number,
    formData: InformationForm
  ): Promise<InformationType | null> => {
    const inputData: InformationSaveApi = formToInformationSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToInformationType(data ?? null)
  }

  const setInformationTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!informationRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...informationRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setInformationImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!informationRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...(informationRef.value.imageSettings
        ? informationRef.value.imageSettings
        : {}),
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  return {
    loadInformation: loadData,
    getInformation: get,
    createInformation,
    updateInformation,
    removeInformation: remove,
    setInformationTitleSettings,
    setInformationImageSettings,
    updateInformationTitleSettings: updateTitleSettingsWithDebounced,
    updateInformationImageSettings: updateImageSettingsWithDebounced,
    informationRef,
    loading,
  }
}

/**
 * Information API アクションサービス
 * @param customerId
 */
export const useInformationActions = (customerId: Ref<number | null>) => {
  const {
    loadInformation,
    getInformation,
    createInformation,
    updateInformation,
    removeInformation,
    setInformationTitleSettings,
    updateInformationTitleSettings,
    setInformationImageSettings,
    updateInformationImageSettings,
    informationRef,
    loading,
  } = useInformationContent(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async () => {
    await loadInformation()
  }

  const onCreate = async (formData: InformationForm) => {
    const savedData = await createInformation(formData)
    addSnackber?.('Information を登録しました。')
    getInformation(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: InformationForm
  }) => {
    if (!id) return

    const savedData = await updateInformation(id, formData)
    addSnackber?.('Information を更新しました。')
    getInformation(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeInformation(id)
    addSnackber?.('Information を削除しました。')
    getInformation()
  }

  const onUpdateTitleSetting = (
    settings: Partial<TitleSettings>
  ): TitleSettings | undefined => {
    if (!informationRef.value?.id) {
      return
    }
    const newSettings = setInformationTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateInformationTitleSettings(informationRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!informationRef.value?.id) {
      return
    }
    const newSettings = setInformationImageSettings(settings)
    if (!newSettings) {
      return
    }

    updateInformationImageSettings(informationRef.value.id, newSettings)
  }

  return {
    informationRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
    loading,
  }
}
