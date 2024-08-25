import type {
  InformationType,
  InformationForm,
  ImageSettings,
} from '@/types/content'
import type {
  InformationGetApi,
  InformationSaveApi,
} from '@/types/API/content-api'

const apiKind = 'informations'
export const getInformationKind = () => apiKind

const useInformationContent = (customerId: Ref<number | null>) => {
  const {
    loadData,
    get,
    setImageSettings,
    contentDataRef,
    loadingRef: readLoading,
  } = useContentRead<InformationGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updateImageSettingsWithDebounced,
    getDefaultImageSettings,
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
          body: apiData.body,
          image: apiData.image,
        }
      : null

  const informationRef = computed<InformationType | null>(() =>
    apitypeToInformationType(contentDataRef.value)
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const setInformationImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!informationRef.value) return
    if (!informationRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...informationRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const createInformation = async (
    formData: InformationForm
  ): Promise<InformationType | null> => {
    const inputData: InformationSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      ...(formData.image
        ? {
            image: {
              url: formData.image,
              settings: getDefaultImageSettings(),
            },
          }
        : {}),
    }
    const data = await create(inputData)
    return apitypeToInformationType(data ?? null)
  }

  const updateInformation = async (
    contentId: number,
    formData: InformationForm
  ): Promise<InformationType | null> => {
    const settings =
      formData.image === informationRef.value?.image?.url
        ? informationRef.value?.image
          ? informationRef.value.image.settings
          : getDefaultImageSettings()
        : getDefaultImageSettings()
    const inputData: InformationSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      ...(formData.image
        ? {
            image: {
              url: formData.image,
              settings,
            },
          }
        : {}),
    }
    const data = await update(contentId, inputData)
    return apitypeToInformationType(data ?? null)
  }

  const updateInformationImageSettings = (
    contentId: number,
    imageSettings: ImageSettings
  ) => {
    updateImageSettingsWithDebounced(contentId, imageSettings)
  }

  return {
    loadInformation: loadData,
    getInformation: get,
    setInformationImageSettings,
    createInformation,
    updateInformation,
    removeInformation: remove,
    updateInformationImageSettings,
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
    setInformationImageSettings,
    createInformation,
    updateInformation,
    removeInformation,
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

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!informationRef.value?.id) return

    const newSettings = setInformationImageSettings(settings)
    if (!newSettings) return

    updateInformationImageSettings(informationRef.value.id, newSettings)
  }

  return {
    informationRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateImageSetting,
    loading,
  }
}
