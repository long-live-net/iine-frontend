import type {
  MenuImageForm,
  MenuImageType,
  ContentPosition,
} from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  MenuImageGetApi,
  MenuImageSaveApi,
  ContentPositionApi,
} from '@/types/API/content-api'

const apiKind = 'menu-images'
export const getMenuImageKind = () => apiKind

const useMenuImageContent = (customerId: Ref<number | null>) => {
  const {
    loadData,
    loadList,
    set,
    get,
    getList,
    setListPositions,
    contentDataRef,
    contentListRef,
    loadingRef: readLoading,
  } = useContentRead<MenuImageGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updatePositions,
    updateImageSettingsWithDebounced,
    getDefaultImageSettings,
    loadingRef: writeLoading,
  } = useContentWrite<MenuImageSaveApi, MenuImageGetApi>(customerId, apiKind)

  const apiToMenuImageType = (
    apiData?: MenuImageGetApi | null
  ): MenuImageType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          caption: apiData.caption,
          image: {
            url: apiData.image.url,
            name: apiData.image.name ?? 'dummy_name',
            type:
              apiData.image.type ??
              getFileTypeByExtention(getFileExtension(apiData.image.url)),
            settings: apiData.image.settings,
          },
          position: apiData.position,
          menuImage: {
            name: apiData.menuImage.name,
            type: apiData.menuImage.type,
            url: apiData.menuImage.url,
          },
        }
      : null

  const menuImageRef = computed<MenuImageType | null>(() =>
    apiToMenuImageType(contentDataRef.value)
  )
  const menuImageListRef = computed<MenuImageType[] | null>(
    () =>
      contentListRef.value?.list?.map(
        (n) => apiToMenuImageType(n) ?? ({} as MenuImageType)
      ) ?? null
  )
  const menuImageTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToMenuImageSaveApi = (
    formData: MenuImageForm
  ): MenuImageSaveApi => ({
    customerId: customerId.value ?? 0,
    title: formData.title,
    caption: formData.caption,
    body: formData.body,
    position: formData.position,
    image: {
      url: formData.image,
      name: formData.imageName,
      type: formData.imageType,
      settings: formData.imageSettings ?? getDefaultImageSettings(),
    },
    menuImage: {
      url: formData.menuImageUrl,
      name: formData.menuImageName,
      type: formData.menuImageType,
    },
  })

  const createMenuImage = async (
    formData: MenuImageForm
  ): Promise<MenuImageType | null> => {
    const data = await create(formToMenuImageSaveApi(formData))
    return apiToMenuImageType(data ?? null)
  }

  const updateMenuImage = async (
    contentId: number,
    formData: MenuImageForm
  ): Promise<MenuImageType | null> => {
    const data = await update(contentId, formToMenuImageSaveApi(formData))
    return apiToMenuImageType(data ?? null)
  }

  const setMenuImageListPositions = (
    menuImageList: MenuImageType[]
  ): ContentPosition[] => {
    const positions = menuImageList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    return positions
  }

  return {
    loadMenuImage: loadData,
    loadMenuImageList: loadList,
    setMenuImage: set,
    getMenuImage: get,
    getMenuImageList: getList,
    setMenuImageListPositions,
    createMenuImage,
    updateMenuImage,
    removeMenuImage: remove,
    updateMenuImageImageSettings: updateImageSettingsWithDebounced,
    updateMenuImageListPositions: updatePositions,
    menuImageRef,
    menuImageListRef,
    menuImageTotalRef,
    loading,
  }
}

/**
 * menuImage list API アクションサービス
 * @param customerId
 */
export const useMenuImageListActions = (customerId: Ref<number | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ id: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const {
    loadMenuImageList,
    getMenuImageList,
    setMenuImageListPositions,
    createMenuImage,
    updateMenuImage,
    removeMenuImage,
    updateMenuImageListPositions,
    menuImageListRef,
    loading,
  } = useMenuImageContent(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async () => {
    await loadMenuImageList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (formData: MenuImageForm) => {
    await createMenuImage(formData)
    addSnackber?.('Menu を登録しました。')
    getMenuImageList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: MenuImageForm
  }) => {
    if (!id) return

    await updateMenuImage(id, formData)
    addSnackber?.('Menu を更新しました。')
    getMenuImageList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: number) => {
    await removeMenuImage(id)
    addSnackber?.('Menu を削除しました。')
    getMenuImageList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (menuImages: MenuImageType[]) => {
    await updateMenuImageListPositions(setMenuImageListPositions(menuImages))
    addSnackber?.('位置を変更しました。')
    getMenuImageList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    menuImageListRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}
