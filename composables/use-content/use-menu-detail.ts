import type {
  MenuDetailForm,
  MenuDetailType,
  TitleSettings,
  ImageSettings,
  ContentPosition,
} from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  MenuDetailGetApi,
  MenuDetailSaveApi,
  ContentPositionApi,
} from '@/types/API/content-api'

const apiKind = 'menuDetails'
export const getMenuDetailKind = () => apiKind

const useMenuDetailContent = (customerId: Ref<string | null>) => {
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
  } = useContentRead<MenuDetailGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updatePositions,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<MenuDetailSaveApi, MenuDetailGetApi>(customerId, apiKind)

  const apitypeToMenuDetailType = (
    apiData?: MenuDetailGetApi | null
  ): MenuDetailType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          menuId: apiData.menuId,
          title: apiData.title,
          titleSettings: {
            ...getDefaultTitleSettings(),
            ...(apiData.titleSettings ? apiData.titleSettings : {}),
          },
          price: apiData.price,
          caption: apiData.caption,
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
          isHilight: apiData.isHilight,
          position: apiData.position,
        }
      : null

  const menuDetailRef = computed<MenuDetailType | null>(() =>
    apitypeToMenuDetailType(contentDataRef.value)
  )
  const menuDetailListRef = computed<MenuDetailType[] | null>(
    () =>
      contentListRef.value?.list?.map(
        (n) => apitypeToMenuDetailType(n) ?? ({} as MenuDetailType)
      ) ?? null
  )
  const menuDetailTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToMenuDetailSaveApi = (
    formData: MenuDetailForm
  ): MenuDetailSaveApi => ({
    customerId: customerId.value ?? '',
    menuId: formData.menuId,
    title: formData.title,
    titleSettings: { ...formData.titleSettings },
    price: formData.price,
    caption: formData.caption,
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
    position: formData.position,
    isHilight: formData.isHilight,
  })

  const createMenuDetail = async (
    formData: MenuDetailForm
  ): Promise<MenuDetailType | null> => {
    const inputData: MenuDetailSaveApi = formToMenuDetailSaveApi(formData)
    const data = await create(inputData)
    return apitypeToMenuDetailType(data ?? null)
  }

  const updateMenuDetail = async (
    contentId: string,
    formData: MenuDetailForm
  ): Promise<MenuDetailType | null> => {
    const inputData: MenuDetailSaveApi = formToMenuDetailSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToMenuDetailType(data ?? null)
  }

  const setMenuDetailTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!menuDetailRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...menuDetailRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setMenuDetailImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!menuDetailRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...(menuDetailRef.value.imageSettings
        ? menuDetailRef.value.imageSettings
        : {}),
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const setMenuDetailListPositions = (
    menuDetailList: MenuDetailType[]
  ): ContentPosition[] => {
    const positions = menuDetailList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    return positions
  }

  return {
    loadMenuDetail: loadData,
    loadMenuDetailList: loadList,
    setMenuDetail: set,
    getMenuDetail: get,
    getMenuDetailList: getList,
    setMenuDetailListPositions,
    createMenuDetail,
    updateMenuDetail,
    removeMenuDetail: remove,
    setMenuDetailTitleSettings,
    setMenuDetailImageSettings,
    updateMenuDetailListPositions: updatePositions,
    getMenuDetailPreNextId: getPreNextId,
    updateMenuDetailTitleSettings: updateTitleSettingsWithDebounced,
    updateMenuDetailImageSettings: updateImageSettingsWithDebounced,
    menuDetailRef,
    menuDetailListRef,
    menuDetailTotalRef,
    menuDetailPreNextIdRefRef: preNextIdRef,
    loading,
  }
}

const useMenuDetailListQueriesStore = () => {
  const filter = useState<ListFilter>('menuDetailListFilter', () => ({}))
  const sort = useState<ListSort>('menuDetailListSort', () => ({ position: 1 }))
  const pager = useState<ListPager>('menuDetailListPager', () => ({
    page: 1,
    limit: 20,
  }))
  return { filter, sort, pager }
}

/**
 * menuDetail list API アクションサービス
 * @param customerId
 */
export const useMenuDetailListActions = (customerId: Ref<string | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const { addSnackber } = useSnackbars()
  const listQueries = useMenuDetailListQueriesStore()
  const {
    loadMenuDetailList,
    getMenuDetailList,
    setMenuDetailListPositions,
    createMenuDetail,
    updateMenuDetail,
    removeMenuDetail,
    updateMenuDetailListPositions,
    menuDetailListRef,
    loading,
  } = useMenuDetailContent(customerId)

  const onLoad = async () => {
    await loadMenuDetailList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }
  const onGetList = async () => {
    await getMenuDetailList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }

  const onCreate = async (formData: MenuDetailForm) => {
    await createMenuDetail(formData)
    addSnackber?.('MenuDetail を登録しました。')
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: string
    formData: MenuDetailForm
  }) => {
    if (!id) return

    await updateMenuDetail(id, formData)
    addSnackber?.('MenuDetail を更新しました。')
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: string) => {
    await removeMenuDetail(id)
    addSnackber?.('MenuDetail を削除しました。')
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (menuDetails: MenuDetailType[]) => {
    await updateMenuDetailListPositions(setMenuDetailListPositions(menuDetails))
    addSnackber?.('位置を変更しました。')
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    menuDetailListRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}
