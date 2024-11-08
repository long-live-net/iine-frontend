import type {
  ServiceForm,
  ServiceType,
  TitleSettings,
  ImageSettings,
  ContentPosition,
} from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  ServiceGetApi,
  ServiceSaveApi,
  ContentPositionApi,
} from '@/types/API/content-api'

const apiKind = 'services'
export const getServiceKind = () => apiKind

const useServiceContent = (customerId: Ref<number | null>) => {
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
    contentDataRef,
    contentListRef,
    loadingRef: readLoading,
  } = useContentRead<ServiceGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updatePositions,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<ServiceSaveApi, ServiceGetApi>(customerId, apiKind)

  const apitypeToServiceType = (
    apiData?: ServiceGetApi | null
  ): ServiceType | null =>
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
            settings: apiData.image.settings,
          },
          position: apiData.position,
        }
      : null

  const serviceRef = computed<ServiceType | null>(() =>
    apitypeToServiceType(contentDataRef.value)
  )
  const serviceListRef = computed<ServiceType[] | null>(
    () =>
      contentListRef.value?.list?.map(
        (n) => apitypeToServiceType(n) ?? ({} as ServiceType)
      ) ?? null
  )
  const serviceTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToServiceSaveApi = (formData: ServiceForm): ServiceSaveApi => ({
    customerId: customerId.value ?? 0,
    title: formData.title,
    titleSettings: formData.titleSettings,
    caption: formData.caption,
    body: formData.body,
    position: formData.position,
    image: {
      url: formData.image,
      name: formData.imageName,
      type: formData.imageType,
      settings: formData.imageSettings ?? getDefaultImageSettings(),
    },
  })

  const createService = async (
    formData: ServiceForm
  ): Promise<ServiceType | null> => {
    const inputData: ServiceSaveApi = formToServiceSaveApi(formData)
    const data = await create(inputData)
    return apitypeToServiceType(data ?? null)
  }

  const updateService = async (
    contentId: number,
    formData: ServiceForm
  ): Promise<ServiceType | null> => {
    const inputData: ServiceSaveApi = formToServiceSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToServiceType(data ?? null)
  }

  const setServiceTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!serviceRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...serviceRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setServiceImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!serviceRef.value?.image?.settings) {
      return
    }
    const newSettings: ImageSettings = {
      ...serviceRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const setServiceListPositions = (
    serviceList: ServiceType[]
  ): ContentPosition[] => {
    const positions = serviceList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    return positions
  }

  return {
    loadService: loadData,
    loadServiceList: loadList,
    setService: set,
    getService: get,
    getServiceList: getList,
    setServiceListPositions,
    createService,
    updateService,
    removeService: remove,
    setServiceTitleSettings,
    setServiceImageSettings,
    updateServiceListPositions: updatePositions,
    updateServiceTitleSettings: updateTitleSettingsWithDebounced,
    updateServiceImageSettings: updateImageSettingsWithDebounced,
    serviceRef,
    serviceListRef,
    serviceTotalRef,
    loading,
  }
}

/**
 * service list API アクションサービス
 * @param customerId
 */
export const useServiceListActions = (customerId: Ref<number | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ id: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const {
    loadServiceList,
    getServiceList,
    setServiceListPositions,
    createService,
    updateService,
    removeService,
    updateServiceListPositions,
    serviceListRef,
    loading,
  } = useServiceContent(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = () => loadServiceList(filter.value, sort.value, pager.value)
  const onGetList = () => getServiceList(filter.value, sort.value, pager.value)

  const onCreate = async (formData: ServiceForm) => {
    await createService(formData)
    addSnackber?.('Service を登録しました。')
    getServiceList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: ServiceForm
  }) => {
    if (!id) return

    await updateService(id, formData)
    addSnackber?.('Service を更新しました。')
    getServiceList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: number) => {
    await removeService(id)
    addSnackber?.('Service を削除しました。')
    getServiceList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (services: ServiceType[]) => {
    await updateServiceListPositions(setServiceListPositions(services))
    addSnackber?.('位置を変更しました。')
    getServiceList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    serviceListRef,
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
 * service detail API アクションサービス
 * @param customerId
 */
export const useServiceActions = (customerId: Ref<number | null>) => {
  const {
    loadService,
    getService,
    createService,
    updateService,
    removeService,
    setServiceTitleSettings,
    updateServiceTitleSettings,
    setServiceImageSettings,
    updateServiceImageSettings,
    serviceRef,
    loading,
  } = useServiceContent(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async (id?: number) => {
    await loadService(id)
  }

  const onCreate = async (formData: ServiceForm) => {
    const savedData = await createService(formData)
    addSnackber?.('Service を登録しました。')
    await getService(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: ServiceForm
  }) => {
    if (!id) return

    const savedData = await updateService(id, formData)
    addSnackber?.('Service を更新しました。')
    await getService(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeService(id)
    addSnackber?.('Service を削除しました。')
    await getService()
  }

  const onUpdateTitleSetting = (
    settings: Partial<TitleSettings>
  ): TitleSettings | undefined => {
    if (!serviceRef.value?.id) {
      return
    }
    const newSettings = setServiceTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateServiceTitleSettings(serviceRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!serviceRef.value?.id) return

    const newSettings = setServiceImageSettings(settings)
    if (!newSettings) return

    updateServiceImageSettings(serviceRef.value.id, newSettings)
  }

  return {
    serviceRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
