import type { EyecatchType, EyecatchForm, ImageSettings } from '@/types/content'
import type { EyecatchGetApi, EyecatchSaveApi } from '@/types/API/content-api'

const apiUrl = '/eyecatches'
const useEyecatchContent = (customerId: Ref<number | null>) => {
  const {
    loadData,
    get,
    setImageSettings,
    contentDataRef,
    loadingRef: readLoading,
  } = useContentRead<EyecatchGetApi>(customerId, apiUrl)
  const {
    create,
    update,
    remove,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<EyecatchSaveApi, EyecatchGetApi>(customerId, apiUrl)

  const apitypeToEyecatchType = (
    apiData?: EyecatchGetApi | null
  ): EyecatchType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          subtitle: apiData.subtitle,
          image: apiData.image,
        }
      : null
  const eyecatchRef = computed<EyecatchType | null>(() =>
    apitypeToEyecatchType(contentDataRef.value)
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const setEyecatchImageSettings = (settings: Partial<ImageSettings>) => {
    if (!eyecatchRef.value) return
    if (!eyecatchRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...eyecatchRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const createEyecatch = async (
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
      imageFile: formData.imageFile,
    }
    const data = await create(inputData)
    return apitypeToEyecatchType(data ?? null)
  }

  const updateEyecatch = async (
    contentId: number,
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
      imageFile: formData.imageFile,
    }
    const data = await update(contentId, inputData)
    return apitypeToEyecatchType(data ?? null)
  }

  return {
    loadEyecatch: loadData,
    getEyecatch: get,
    setEyecatchImageSettings,
    createEyecatch,
    updateEyecatch,
    removeEyecatch: remove,
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
    setEyecatchImageSettings,
    createEyecatch,
    updateEyecatch,
    removeEyecatch,
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

  const onUpdateImageSetting = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!eyecatchRef.value?.id) return

    const newSettings = setEyecatchImageSettings(settings)
    if (!newSettings) return

    updateEyecatchImageSettings(eyecatchRef.value.id, newSettings)
  }

  return {
    eyecatchRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateImageSetting,
    loading,
  }
}
