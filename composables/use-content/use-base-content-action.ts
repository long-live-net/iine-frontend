import type {
  ContentType,
  ContentForm,
  TitleSettings,
  ImageSettings,
  ContentPosition,
} from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  ContentGetApi,
  ContentSaveApi,
  ContentPositionApi,
} from '@/types/API/content-api'

const useContentContent = <
  T extends ContentType,
  F extends ContentForm,
  G extends ContentGetApi,
  S extends ContentSaveApi,
>(
  apiKind: string,
  customerId: Ref<string | null>,
  apiToContent: (apiData?: G | null) => T | null,
  formToSaveapi: (formData: F) => S
) => {
  const { getDefaultImageSettings } = useContentInit()
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
  } = useContentRead<G>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updatePositions,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<S, G>(customerId, apiKind)

  const contentRef = computed<T | null>(() =>
    apiToContent(contentDataRef.value)
  )
  const listRef = computed<T[] | null>(
    () =>
      contentListRef.value?.list?.map((n) => apiToContent(n) ?? ({} as T)) ??
      null
  )
  const contentTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const createContent = async (formData: F): Promise<T | null> => {
    const inputData = formToSaveapi(formData)
    const data = await create(inputData)
    return apiToContent(data ?? null)
  }

  const updateContent = async (
    contentId: string,
    formData: F
  ): Promise<T | null> => {
    const inputData = formToSaveapi(formData)
    const data = await update(contentId, inputData)
    return apiToContent(data ?? null)
  }

  const setContentTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!contentRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...contentRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setContentImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!contentRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...(contentRef.value.imageSettings ? contentRef.value.imageSettings : {}),
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const setContentListPositions = (contentList: T[]): ContentPosition[] => {
    const positions = contentList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    return positions
  }

  return {
    loadContent: loadData,
    loadContentList: loadList,
    setContent: set,
    getContent: get,
    getContentList: getList,
    setContentListPositions,
    createContent,
    updateContent,
    removeContent: remove,
    setContentTitleSettings,
    setContentImageSettings,
    updateContentListPositions: updatePositions,
    updateContentTitleSettings: updateTitleSettingsWithDebounced,
    updateContentImageSettings: updateImageSettingsWithDebounced,
    contentRef,
    listRef,
    contentTotalRef,
    loading,
  }
}

export const useContentListActions = <
  T extends ContentType,
  F extends ContentForm,
  G extends ContentGetApi,
  S extends ContentSaveApi,
>(
  apiKind: string,
  contentTitle: string,
  customerId: Ref<string | null>,
  apiToContent: (apiData?: G | null) => T | null,
  formToSaveapi: (formData: F) => S
) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const { addSnackber } = useSnackbars()
  const {
    loadContentList,
    getContentList,
    setContentListPositions,
    createContent,
    updateContent,
    removeContent,
    updateContentListPositions,
    listRef,
    contentTotalRef,
    loading,
  } = useContentContent<T, F, G, S>(
    apiKind,
    customerId,
    apiToContent,
    formToSaveapi
  )

  const onLoad = async () => {
    await loadContentList(filter.value, sort.value, pager.value)
  }
  const onGetList = async () => {
    await getContentList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (formData: F) => {
    await createContent(formData)
    addSnackber?.(`${contentTitle} 情報を登録しました。`)
    getContentList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({ id, formData }: { id: string; formData: F }) => {
    if (!id) return

    await updateContent(id, formData)
    addSnackber?.(`${contentTitle} 情報を更新しました。`)
    getContentList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: string) => {
    await removeContent(id)
    addSnackber?.(`${contentTitle} 情報を削除しました。`)
    getContentList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (contents: T[]) => {
    await updateContentListPositions(setContentListPositions(contents))
    addSnackber?.(`${contentTitle} 表示位置を変更しました。`)
    getContentList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    listRef,
    totalRef: contentTotalRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}

export const useContentActions = <
  T extends ContentType,
  F extends ContentForm,
  G extends ContentGetApi,
  S extends ContentSaveApi,
>(
  apiKind: string,
  contentTitle: string,
  customerId: Ref<string | null>,
  apiToContent: (apiData?: G | null) => T | null,
  formToSaveapi: (formData: F) => S
) => {
  const { addSnackber } = useSnackbars()
  const {
    loadContent,
    getContent,
    createContent,
    updateContent,
    removeContent,
    setContentTitleSettings,
    updateContentTitleSettings,
    setContentImageSettings,
    updateContentImageSettings,
    contentRef,
    loading,
  } = useContentContent<T, F, G, S>(
    apiKind,
    customerId,
    apiToContent,
    formToSaveapi
  )

  const onLoad = async (id?: string) => {
    await loadContent(id)
  }

  const onCreate = async (formData: F) => {
    const savedData = await createContent(formData)
    addSnackber?.(`${contentTitle} 情報を登録しました。`)
    await getContent(savedData?.id)
  }

  const onUpdate = async ({ id, formData }: { id: string; formData: F }) => {
    if (!id) return

    const savedData = await updateContent(id, formData)
    addSnackber?.(`${contentTitle} 情報を更新しました。`)
    await getContent(savedData?.id)
  }

  const onRemove = async (id: string) => {
    await removeContent(id)
    addSnackber?.(`${contentTitle} 情報を削除しました。`)
    await getContent()
  }

  const onUpdateTitleSetting = (
    settings: Partial<TitleSettings>
  ): TitleSettings | undefined => {
    if (!contentRef.value?.id) {
      return
    }
    const newSettings = setContentTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateContentTitleSettings(contentRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!contentRef.value?.id) return

    const newSettings = setContentImageSettings(settings)
    if (!newSettings) return

    updateContentImageSettings(contentRef.value.id, newSettings)
  }

  return {
    contentRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}
