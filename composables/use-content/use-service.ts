import type { ServiceForm, ServiceType } from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  ServiceGetApi,
  ServiceSaveApi,
  ContentPosition,
} from '@/types/API/content-api'

const apiUrl = '/services'
const useServiceContent = (customerId: Ref<number | null>) => {
  const {
    loadData,
    loadList,
    get,
    getList,
    setListPositions,
    contentDataRef,
    contentListRef,
    loadingRef: readLoading,
  } = useContentRead<ServiceGetApi>(customerId, apiUrl)
  const {
    create,
    update,
    remove,
    updatePositions,
    loadingRef: writeLoading,
  } = useContentWrite<ServiceSaveApi, ServiceGetApi>(customerId, apiUrl)

  const apitypeToServiceType = (
    apiData?: ServiceGetApi | null
  ): ServiceType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          caption: apiData.caption,
          body: apiData.body,
          image: apiData.image,
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

  const setServiceListPositions = (
    serviceList: ServiceType[]
  ): ContentPosition[] => {
    const positions: ContentPosition[] = serviceList.map(
      (d, i) => ({ id: d.id, position: i + 1 }) as ContentPosition
    )
    setListPositions(positions)
    return positions
  }

  const createService = async (
    formData: ServiceForm
  ): Promise<ServiceType | null> => {
    const inputData: ServiceSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      caption: formData.caption,
      body: formData.body,
      imageFile: formData.imageFile,
      position: formData.position,
    }
    const data = await create(inputData)
    return apitypeToServiceType(data ?? null)
  }

  const updateService = async (
    contentId: number,
    formData: ServiceForm
  ): Promise<ServiceType | null> => {
    const inputData: ServiceSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      caption: formData.caption,
      body: formData.body,
      imageFile: formData.imageFile,
      position: formData.position,
    }
    const data = await update(contentId, inputData)
    return apitypeToServiceType(data ?? null)
  }

  return {
    loadService: loadData,
    loadServiceList: loadList,
    getService: get,
    getServiceList: getList,
    setServiceListPositions,
    createService,
    updateService,
    removeService: remove,
    updateServiceListPositions: updatePositions,
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

  const onLoad = async () => {
    await loadServiceList(filter.value, sort.value, pager.value)
  }

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
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}
