import type {
  EyecatchType,
  EyecatchForm,
  EyecatchTitleSettings,
  ImageSettings,
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

const useEyecatchContent = (customerId: Ref<number | null>) => {
  const { getDefaultImageSettings } = useContentInit()
  const {
    loadData,
    get,
    setImageSettings,
    contentDataRef,
    loadingRef: readLoading,
  } = useContentRead<EyecatchGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<EyecatchSaveApi, EyecatchGetApi>(customerId, apiKind)

  const apitypeToEyecatchType = (
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

  const eyecatchRef = computed<EyecatchType | null>(() =>
    apitypeToEyecatchType(contentDataRef.value)
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToEyecatchSaveApi = (formData: EyecatchForm): EyecatchSaveApi => ({
    customerId: customerId.value ?? 0,
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

  const createEyecatch = async (
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = formToEyecatchSaveApi(formData)
    const data = await create(inputData)
    return apitypeToEyecatchType(data ?? null)
  }

  const updateEyecatch = async (
    contentId: number,
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = formToEyecatchSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToEyecatchType(data ?? null)
  }

  const setEyecatchTitleSettings = (
    settings: Partial<EyecatchTitleSettings>
  ) => {
    if (!eyecatchRef.value?.titleSettings) {
      return
    }
    const newSettings: EyecatchTitleSettings = {
      ...eyecatchRef.value.titleSettings,
      ...settings,
    }
    eyecatchRef.value.titleSettings = { ...newSettings }
    return newSettings
  }

  const setEyecatchImageSettings = (settings: Partial<ImageSettings>) => {
    if (!eyecatchRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...eyecatchRef.value.imageSettings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  return {
    loadEyecatch: loadData,
    getEyecatch: get,
    createEyecatch,
    updateEyecatch,
    removeEyecatch: remove,
    setEyecatchTitleSettings,
    setEyecatchImageSettings,
    updateEyecatchTitleSettings: updateTitleSettingsWithDebounced,
    updateEyecatchImageSettings: updateImageSettingsWithDebounced,
    eyecatchRef,
    loading,
  }
}

/**
 * Eyecatch API アクションサービス
 * @param customerId
 */
export const useEyecatchActions = (customerId: Ref<number | null>) => {
  const {
    loadEyecatch,
    getEyecatch,
    createEyecatch,
    updateEyecatch,
    removeEyecatch,
    setEyecatchTitleSettings,
    updateEyecatchTitleSettings,
    setEyecatchImageSettings,
    updateEyecatchImageSettings,
    eyecatchRef,
    loading,
  } = useEyecatchContent(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async () => {
    await loadEyecatch()
  }

  const onCreate = async (formData: EyecatchForm) => {
    const savedData = await createEyecatch(formData)
    addSnackber?.('トップ画像を登録しました。')
    await getEyecatch(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: EyecatchForm
  }) => {
    if (!id) return

    const savedData = await updateEyecatch(id, formData)
    addSnackber?.('トップ画像を更新しました。')
    await getEyecatch(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeEyecatch(id)
    addSnackber?.('トップ画像を削除しました。')
    await getEyecatch()
  }

  const onUpdateTitleSetting = (
    settings: Partial<EyecatchTitleSettings>
  ): EyecatchTitleSettings | undefined => {
    if (!eyecatchRef.value?.id) {
      return
    }
    const newSettings = setEyecatchTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateEyecatchTitleSettings(eyecatchRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!eyecatchRef.value?.id) {
      return
    }
    const newSettings = setEyecatchImageSettings(settings)
    if (!newSettings) {
      return
    }
    updateEyecatchImageSettings(eyecatchRef.value.id, newSettings)
  }

  return {
    eyecatchRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
    loading,
  }
}
