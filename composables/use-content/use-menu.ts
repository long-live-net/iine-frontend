import type {
  MenuForm,
  MenuType,
  TitleSettings,
  ImageSettings,
  ContentPosition,
} from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  MenuGetApi,
  MenuSaveApi,
  ContentPositionApi,
} from '@/types/API/content-api'

const apiKind = 'menus'
export const getMenuKind = () => apiKind

const useMenuContent = (customerId: Ref<string | null>) => {
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
  } = useContentRead<MenuGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updatePositions,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<MenuSaveApi, MenuGetApi>(customerId, apiKind)

  const apitypeToMenuType = (apiData?: MenuGetApi | null): MenuType | null =>
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

  const menuRef = computed<MenuType | null>(() =>
    apitypeToMenuType(contentDataRef.value)
  )
  const menuListRef = computed<MenuType[] | null>(
    () =>
      contentListRef.value?.list?.map(
        (n) => apitypeToMenuType(n) ?? ({} as MenuType)
      ) ?? null
  )
  const menuTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToMenuSaveApi = (formData: MenuForm): MenuSaveApi => ({
    customerId: customerId.value ?? '',
    title: formData.title,
    titleSettings: { ...formData.titleSettings },
    caption: formData.caption,
    position: formData.position,
    image: {
      url: formData.image,
      name: formData.imageName,
      type: formData.imageType,
    },
    imageSettings: { ...(formData.imageSettings ?? getDefaultImageSettings()) },
  })

  const createMenu = async (formData: MenuForm): Promise<MenuType | null> => {
    const inputData: MenuSaveApi = formToMenuSaveApi(formData)
    const data = await create(inputData)
    return apitypeToMenuType(data ?? null)
  }

  const updateMenu = async (
    contentId: string,
    formData: MenuForm
  ): Promise<MenuType | null> => {
    const inputData: MenuSaveApi = formToMenuSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToMenuType(data ?? null)
  }

  const setMenuTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!menuRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...menuRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setMenuImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!menuRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...(menuRef.value.imageSettings ? menuRef.value.imageSettings : {}),
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const setMenuListPositions = (menuList: MenuType[]): ContentPosition[] => {
    const positions = menuList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    return positions
  }

  return {
    loadMenu: loadData,
    loadMenuList: loadList,
    setMenu: set,
    getMenu: get,
    getMenuList: getList,
    setMenuListPositions,
    createMenu,
    updateMenu,
    removeMenu: remove,
    setMenuTitleSettings,
    setMenuImageSettings,
    updateMenuListPositions: updatePositions,
    getMenuPreNextId: getPreNextId,
    updateMenuTitleSettings: updateTitleSettingsWithDebounced,
    updateMenuImageSettings: updateImageSettingsWithDebounced,
    menuRef,
    menuListRef,
    menuTotalRef,
    menuPreNextIdRefRef: preNextIdRef,
    loading,
  }
}

const useMenuListQueriesStore = () => {
  const filter = useState<ListFilter>('menuListFilter', () => ({}))
  const sort = useState<ListSort>('menuListSort', () => ({ position: 1 }))
  const pager = useState<ListPager>('menuListPager', () => ({
    page: 1,
    limit: 20,
  }))
  return { filter, sort, pager }
}

/**
 * menu list API アクションサービス
 * @param customerId
 */
export const useMenuListActions = (customerId: Ref<string | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const { addSnackber } = useSnackbars()
  const listQueries = useMenuListQueriesStore()
  const {
    loadMenuList,
    getMenuList,
    setMenuListPositions,
    createMenu,
    updateMenu,
    removeMenu,
    updateMenuListPositions,
    menuListRef,
    loading,
  } = useMenuContent(customerId)

  const onLoad = async () => {
    await loadMenuList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }
  const onGetList = async () => {
    await getMenuList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }

  const onCreate = async (formData: MenuForm) => {
    await createMenu(formData)
    addSnackber?.('Menu を登録しました。')
    getMenuList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: string
    formData: MenuForm
  }) => {
    if (!id) return

    await updateMenu(id, formData)
    addSnackber?.('Menu を更新しました。')
    getMenuList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: string) => {
    await removeMenu(id)
    addSnackber?.('Menu を削除しました。')
    getMenuList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (menus: MenuType[]) => {
    await updateMenuListPositions(setMenuListPositions(menus))
    addSnackber?.('位置を変更しました。')
    getMenuList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    menuListRef,
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
 * menu detail API アクションサービス
 * @param customerId
 */
export const useMenuActions = (customerId: Ref<string | null>) => {
  const { addSnackber } = useSnackbars()
  const { filter, sort } = useMenuListQueriesStore()
  const {
    loadMenu,
    getMenu,
    createMenu,
    updateMenu,
    removeMenu,
    setMenuTitleSettings,
    updateMenuTitleSettings,
    setMenuImageSettings,
    updateMenuImageSettings,
    getMenuPreNextId,
    menuRef,
    menuPreNextIdRefRef,
    loading,
  } = useMenuContent(customerId)

  const onLoad = async (id?: string) => {
    await loadMenu(id)
    if (menuRef.value) {
      await getMenuPreNextId(menuRef.value.id, filter.value, sort.value)
    }
  }

  const onCreate = async (formData: MenuForm) => {
    const savedData = await createMenu(formData)
    addSnackber?.('Menu を登録しました。')
    await getMenu(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: string
    formData: MenuForm
  }) => {
    if (!id) return

    const savedData = await updateMenu(id, formData)
    addSnackber?.('Menu を更新しました。')
    await getMenu(savedData?.id)
  }

  const onRemove = async (id: string) => {
    await removeMenu(id)
    addSnackber?.('Menu を削除しました。')
    await getMenu()
  }

  const onUpdateTitleSetting = (
    settings: Partial<TitleSettings>
  ): TitleSettings | undefined => {
    if (!menuRef.value?.id) {
      return
    }
    const newSettings = setMenuTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateMenuTitleSettings(menuRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!menuRef.value?.id) return

    const newSettings = setMenuImageSettings(settings)
    if (!newSettings) return

    updateMenuImageSettings(menuRef.value.id, newSettings)
  }

  return {
    menuRef,
    menuPreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
