import type {
  FeatureForm,
  FeatureType,
  TitleSettings,
  ImageSettings,
  ContentPosition,
} from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  FeatureGetApi,
  FeatureSaveApi,
  ContentPositionApi,
} from '@/types/API/content-api'

const apiKind = 'features'
export const getFeatureKind = () => apiKind

const useFeatureContent = (customerId: Ref<number | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()
  const {
    loadData,
    loadList,
    set,
    get,
    getList,
    setTitleSettings,
    setImageSettings,
    setListPositions,
    getPreNextId,
    contentDataRef,
    contentListRef,
    preNextIdRef,
    loadingRef: readLoading,
  } = useContentRead<FeatureGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updatePositions,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<FeatureSaveApi, FeatureGetApi>(customerId, apiKind)

  const apitypeToFeatureType = (
    apiData?: FeatureGetApi | null
  ): FeatureType | null =>
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

  const featureRef = computed<FeatureType | null>(() =>
    apitypeToFeatureType(contentDataRef.value)
  )
  const featureListRef = computed<FeatureType[] | null>(
    () =>
      contentListRef.value?.list?.map(
        (n) => apitypeToFeatureType(n) ?? ({} as FeatureType)
      ) ?? null
  )
  const featureTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToFeatureSaveApi = (formData: FeatureForm): FeatureSaveApi => ({
    customerId: customerId.value ?? 0,
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

  const createFeature = async (
    formData: FeatureForm
  ): Promise<FeatureType | null> => {
    const inputData: FeatureSaveApi = formToFeatureSaveApi(formData)
    const data = await create(inputData)
    return apitypeToFeatureType(data ?? null)
  }

  const updateFeature = async (
    contentId: number,
    formData: FeatureForm
  ): Promise<FeatureType | null> => {
    const inputData: FeatureSaveApi = formToFeatureSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToFeatureType(data ?? null)
  }

  const setFeatureTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!featureRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...featureRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setFeatureImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!featureRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...(featureRef.value.imageSettings ? featureRef.value.imageSettings : {}),
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const setFeatureListPositions = (
    featureList: FeatureType[]
  ): ContentPosition[] => {
    const positions = featureList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    return positions
  }

  return {
    loadFeature: loadData,
    loadFeatureList: loadList,
    setFeature: set,
    getFeature: get,
    getFeatureList: getList,
    setFeatureListPositions,
    createFeature,
    updateFeature,
    removeFeature: remove,
    setFeatureTitleSettings,
    setFeatureImageSettings,
    updateFeatureListPositions: updatePositions,
    getFeaturePreNextId: getPreNextId,
    updateFeatureTitleSettings: updateTitleSettingsWithDebounced,
    updateFeatureImageSettings: updateImageSettingsWithDebounced,
    featureRef,
    featureListRef,
    featureTotalRef,
    featurePreNextIdRefRef: preNextIdRef,
    loading,
  }
}

const useFeatureListQueriesStore = () => {
  const filter = useState<ListFilter>('featureListFilter', () => ({}))
  const sort = useState<ListSort>('featureListSort', () => ({ position: 1 }))
  const pager = useState<ListPager>('featureListPager', () => ({
    page: 1,
    limit: 20,
  }))
  return { filter, sort, pager }
}

/**
 * feature list API アクションサービス
 * @param customerId
 */
export const useFeatureListActions = (customerId: Ref<number | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const { addSnackber } = useSnackbars()
  const listQueries = useFeatureListQueriesStore()
  const {
    loadFeatureList,
    getFeatureList,
    setFeatureListPositions,
    createFeature,
    updateFeature,
    removeFeature,
    updateFeatureListPositions,
    featureListRef,
    loading,
  } = useFeatureContent(customerId)

  const onLoad = async () => {
    await loadFeatureList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }
  const onGetList = async () => {
    await getFeatureList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }

  const onCreate = async (formData: FeatureForm) => {
    await createFeature(formData)
    addSnackber?.('Feature を登録しました。')
    getFeatureList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: FeatureForm
  }) => {
    if (!id) return

    await updateFeature(id, formData)
    addSnackber?.('Feature を更新しました。')
    getFeatureList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: number) => {
    await removeFeature(id)
    addSnackber?.('Feature を削除しました。')
    getFeatureList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (features: FeatureType[]) => {
    await updateFeatureListPositions(setFeatureListPositions(features))
    addSnackber?.('位置を変更しました。')
    getFeatureList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    featureListRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}

/**
 * feature detail API アクションサービス
 * @param customerId
 */
export const useFeatureActions = (customerId: Ref<number | null>) => {
  const { addSnackber } = useSnackbars()
  const { filter, sort } = useFeatureListQueriesStore()
  const {
    loadFeature,
    getFeature,
    createFeature,
    updateFeature,
    removeFeature,
    setFeatureTitleSettings,
    updateFeatureTitleSettings,
    setFeatureImageSettings,
    updateFeatureImageSettings,
    getFeaturePreNextId,
    featureRef,
    featurePreNextIdRefRef,
    loading,
  } = useFeatureContent(customerId)

  const onLoad = async (id?: number) => {
    await loadFeature(id)
    if (featureRef.value) {
      await getFeaturePreNextId(featureRef.value.id, filter.value, sort.value)
    }
  }

  const onCreate = async (formData: FeatureForm) => {
    const savedData = await createFeature(formData)
    addSnackber?.('Feature を登録しました。')
    await getFeature(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: FeatureForm
  }) => {
    if (!id) return

    const savedData = await updateFeature(id, formData)
    addSnackber?.('Feature を更新しました。')
    await getFeature(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeFeature(id)
    addSnackber?.('Feature を削除しました。')
    await getFeature()
  }

  const onUpdateTitleSetting = (
    settings: Partial<TitleSettings>
  ): TitleSettings | undefined => {
    if (!featureRef.value?.id) {
      return
    }
    const newSettings = setFeatureTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateFeatureTitleSettings(featureRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!featureRef.value?.id) return

    const newSettings = setFeatureImageSettings(settings)
    if (!newSettings) return

    updateFeatureImageSettings(featureRef.value.id, newSettings)
  }

  return {
    featureRef,
    featurePreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
