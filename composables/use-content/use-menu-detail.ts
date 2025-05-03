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

const apiKind = 'menu-details'
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
    contentDataRef,
    contentListRef,
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
          categoryId: apiData.categoryId,
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
    menuId: string,
    categoryId: string,
    formData: MenuDetailForm
  ): MenuDetailSaveApi => ({
    customerId: customerId.value ?? '',
    menuId,
    categoryId,
    isHilight: formData.isHilight,
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
  })

  const createMenuDetail = async (
    menuId: string,
    categoryId: string,
    formData: MenuDetailForm
  ): Promise<MenuDetailType | null> => {
    const inputData: MenuDetailSaveApi = formToMenuDetailSaveApi(
      menuId,
      categoryId,
      formData
    )
    const data = await create(inputData)
    return apitypeToMenuDetailType(data ?? null)
  }

  const updateMenuDetail = async (
    contentId: string,
    menuId: string,
    categoryId: string,
    formData: MenuDetailForm
  ): Promise<MenuDetailType | null> => {
    const inputData: MenuDetailSaveApi = formToMenuDetailSaveApi(
      menuId,
      categoryId,
      formData
    )
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
    menuDetailList: MenuDetailType[],
    categoryId: string
  ): ContentPosition[] => {
    const positions = menuDetailList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
      categoryId,
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
    updateMenuDetailTitleSettings: updateTitleSettingsWithDebounced,
    updateMenuDetailImageSettings: updateImageSettingsWithDebounced,
    menuDetailRef,
    menuDetailListRef,
    menuDetailTotalRef,
    loading,
  }
}

/**
 * menuDetail list API アクションサービス
 * @param customerId
 */
export const useMenuDetailListActions = (customerId: Ref<string | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const contentTitle = 'メニュー項目'
  const { addSnackber } = useSnackbars()
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
  }
  const onGetList = async () => {
    await getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (
    menuId: string,
    categoryId: string,
    formData: MenuDetailForm
  ) => {
    await createMenuDetail(menuId, categoryId, formData)
    addSnackber?.(`${contentTitle} 情報を登録しました。`)
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    menuId,
    categoryId,
    formData,
  }: {
    id: string
    menuId: string
    categoryId: string
    formData: MenuDetailForm
  }) => {
    if (!id) return

    await updateMenuDetail(id, menuId, categoryId, formData)
    addSnackber?.(`${contentTitle} 情報を更新しました。`)
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: string) => {
    await removeMenuDetail(id)
    addSnackber?.(`${contentTitle} 情報を削除しました。`)
    getMenuDetailList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (
    menuDetails: MenuDetailType[],
    categoryId: string
  ) => {
    await updateMenuDetailListPositions(
      setMenuDetailListPositions(menuDetails, categoryId)
    )
    addSnackber?.(`${contentTitle} 表示位置を変更しました。`)
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
