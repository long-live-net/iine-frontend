import type {
  NewsType,
  NewsForm,
  TitleSettings,
  ImageSettings,
} from '@/types/content'
import type {
  NewsGetApi,
  NewsSaveApi,
  ListFilter,
  ListSort,
  ListPager,
} from '@/types/API/content-api'

const apiKind = 'newses'
export const getNewsKind = () => apiKind

const useNewsContent = (customerId: Ref<number | null>) => {
  const { getDefaultTitleSettings, getDefaultImageSettings } = useContentInit()
  const {
    loadData,
    loadList,
    get,
    getList,
    setTitleSettings,
    setImageSettings,
    getPreNextId,
    contentDataRef,
    contentListRef,
    preNextIdRef,
    loadingRef: readLoading,
  } = useContentRead<NewsGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updateTitleSettingsWithDebounced,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<NewsSaveApi, NewsGetApi>(customerId, apiKind)

  const apitypeToNewsType = (apiData?: NewsGetApi | null): NewsType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          titleSettings: {
            ...getDefaultTitleSettings(),
            ...(apiData.titleSettings ? apiData.titleSettings : {}),
          },
          category: apiData.category,
          publishOn: apiData.publishOn,
          body: apiData.body,
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
        }
      : null

  const newsRef = computed<NewsType | null>(() =>
    apitypeToNewsType(contentDataRef.value)
  )
  const newsListRef = computed<NewsType[] | null>(
    () =>
      contentListRef.value?.list?.map(
        (n) => apitypeToNewsType(n) ?? ({} as NewsType)
      ) ?? null
  )
  const newsTotalRef = computed<number | null>(
    () => contentListRef.value?.total ?? null
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToNewsSaveApi = (formData: NewsForm): NewsSaveApi => ({
    customerId: customerId.value ?? 0,
    title: formData.title,
    titleSettings: { ...formData.titleSettings },
    category: formData.category ?? 'I',
    publishOn: formData.publishOn ?? localDate(),
    body: formData.body,
    ...(formData.image && formData.imageName && formData.imageType
      ? {
          image: {
            url: formData.image,
            name: formData.imageName,
            type: formData.imageType,
          },
        }
      : {}),
    ...(formData.imageSettings
      ? {
          imageSettings: {
            ...getDefaultImageSettings(),
            ...formData.imageSettings,
          },
        }
      : {}),
  })

  const createNews = async (formData: NewsForm): Promise<NewsType | null> => {
    const inputData: NewsSaveApi = formToNewsSaveApi(formData)
    const data = await create(inputData)
    return apitypeToNewsType(data ?? null)
  }

  const updateNews = async (
    contentId: number,
    formData: NewsForm
  ): Promise<NewsType | null> => {
    const inputData: NewsSaveApi = formToNewsSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToNewsType(data ?? null)
  }

  const setNewsTitleSettings = (settings: Partial<TitleSettings>) => {
    if (!newsRef.value?.titleSettings) {
      return
    }
    const newSettings: TitleSettings = {
      ...newsRef.value.titleSettings,
      ...settings,
    }
    setTitleSettings(newSettings)
    return newSettings
  }

  const setNewsImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!newsRef.value) {
      return
    }
    const newSettings: ImageSettings = {
      ...getDefaultImageSettings(),
      ...(newsRef.value.imageSettings ? newsRef.value.imageSettings : {}),
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  return {
    loadNews: loadData,
    loadNewsList: loadList,
    getNews: get,
    getNewsList: getList,
    createNews,
    updateNews,
    removeNews: remove,
    setNewsTitleSettings,
    setNewsImageSettings,
    getNewsPreNextId: getPreNextId,
    updateNewsTitleSettings: updateTitleSettingsWithDebounced,
    updateNewsImageSettings: updateImageSettingsWithDebounced,
    newsRef,
    newsListRef,
    newsTotalRef,
    newsPreNextIdRefRef: preNextIdRef,
    loading,
  }
}

const useNewsListQueriesStore = () => {
  const filter = useState<ListFilter>('newsListFilter', () => ({
    publishOn: true,
  }))
  const sort = useState<ListSort>('newsListSort', () => ({ publishOn: -1 }))
  const pager = useState<ListPager>('newsListPager', () => ({
    page: 1,
    limit: 20,
  }))
  return { filter, sort, pager }
}

/**
 * news list API アクションサービス
 * @param customerId
 */
export const useNewsListActions = (customerId: Ref<number | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ id: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const { addSnackber } = useSnackbars()
  const listQueries = useNewsListQueriesStore()
  const {
    loadNewsList,
    getNewsList,
    newsListRef,
    newsTotalRef,
    createNews,
    updateNews,
    removeNews,
    loading,
  } = useNewsContent(customerId)

  const onLoad = async () => {
    await loadNewsList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }

  const getList = async () => {
    await getNewsList(filter.value, sort.value, pager.value)
    listQueries.filter.value = filter.value
    listQueries.sort.value = sort.value
    listQueries.pager.value = pager.value
  }

  const onCreate = async (formData: NewsForm) => {
    await createNews(formData)
    addSnackber?.('News を登録しました。')
    await getNewsList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: NewsForm
  }) => {
    if (!id) return

    await updateNews(id, formData)
    addSnackber?.('News を更新しました。')
    await getNewsList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: number) => {
    await removeNews(id)
    addSnackber?.('News を削除しました。')
    await getNewsList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    newsListRef,
    newsTotalRef,
    loading,
    onLoad,
    getList,
    onCreate,
    onUpdate,
    onRemove,
  }
}

/**
 * news API アクションサービス
 * @param customerId
 */
export const useNewsActions = (customerId: Ref<number | null>) => {
  const { addSnackber } = useSnackbars()
  const { filter, sort } = useNewsListQueriesStore()
  const {
    loadNews,
    getNews,
    createNews,
    updateNews,
    removeNews,
    setNewsTitleSettings,
    updateNewsTitleSettings,
    setNewsImageSettings,
    updateNewsImageSettings,
    getNewsPreNextId,
    newsRef,
    newsPreNextIdRefRef,
    loading,
  } = useNewsContent(customerId)

  const onLoad = async (id?: number) => {
    await loadNews(id)
    if (newsRef.value) {
      await getNewsPreNextId(newsRef.value.id, filter.value, sort.value)
    }
  }

  const onCreate = async (formData: NewsForm) => {
    const savedData = await createNews(formData)
    addSnackber?.('News を登録しました。')
    await getNews(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: NewsForm
  }) => {
    if (!id) return

    const savedData = await updateNews(id, formData)
    addSnackber?.('News を更新しました。')
    await getNews(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeNews(id)
    addSnackber?.('News を削除しました。')
    await getNews()
  }

  const onUpdateTitleSetting = (
    settings: Partial<TitleSettings>
  ): TitleSettings | undefined => {
    if (!newsRef.value?.id) {
      return
    }
    const newSettings = setNewsTitleSettings(settings)
    if (!newSettings) {
      return
    }
    updateNewsTitleSettings(newsRef.value.id, newSettings)
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!newsRef.value?.id) {
      return
    }
    const newSettings = setNewsImageSettings(settings)
    if (!newSettings) {
      return
    }
    updateNewsImageSettings(newsRef.value.id, newSettings)
  }

  return {
    newsRef,
    newsPreNextIdRefRef,
    loading,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateTitleSetting,
    onUpdateImageSetting,
  }
}

export const useNewsCategory = () => {
  const { customerSetting } = useCustomerSetting()

  const categoryItems = computed(
    () => customerSetting.value?.newsCategories ?? []
  )
  const category2BkColor = [
    '#2962FF',
    '#4CAF50',
    '#FFEA00',
    '#E53935',
    '#ECEFF1',
    '#AA00FF',
  ]
  const category2Color = ['white', 'white', 'black', 'white', 'black', 'white']

  const getCategory2BkColor = (category: string) => {
    const index = Math.abs(
      categoryItems.value.findIndex((c) => c === category) %
        category2BkColor.length
    )
    return category2BkColor[index]
  }

  const getCategory2Color = (category: string) => {
    const index = Math.abs(
      categoryItems.value.findIndex((c) => c === category) %
        category2Color.length
    )
    return category2Color[index]
  }

  return {
    categoryItems,
    getCategory2BkColor,
    getCategory2Color,
  }
}
