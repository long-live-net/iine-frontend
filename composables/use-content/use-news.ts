import type { NewsType, NewsForm, ImageSettings } from '@/types/content'
import type {
  NewsGetApi,
  NewsSaveApi,
  ListFilter,
  ListSort,
  ListPager,
} from '@/types/API/content-api'

const apiUrl = '/newses'
const useNewsContent = (customerId: Ref<number | null>) => {
  const {
    loadData,
    loadList,
    get,
    getList,
    setImageSettings,
    getPreNextId,
    contentDataRef,
    contentListRef,
    preNextIdRef,
    loadingRef: readLoading,
  } = useContentRead<NewsGetApi>(customerId, apiUrl)
  const {
    create,
    update,
    remove,
    updateImageSettingsWithDebounced,
    loadingRef: writeLoading,
  } = useContentWrite<NewsSaveApi, NewsGetApi>(customerId, apiUrl)

  const apitypeToNewsType = (apiData?: NewsGetApi | null): NewsType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          category: apiData.category,
          publishOn: apiData.publishOn,
          body: apiData.body,
          image: apiData.image,
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

  const setNewsImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | void => {
    if (!newsRef.value) return
    if (!newsRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...newsRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const createNews = async (formData: NewsForm): Promise<NewsType | null> => {
    const inputData: NewsSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      category: formData.category ?? 'I',
      publishOn: formData.publishOn ?? localDate(),
      body: formData.body,
      imageFile: formData.imageFile,
    }
    const data = await create(inputData)
    return apitypeToNewsType(data ?? null)
  }

  const updateNews = async (
    contentId: number,
    formData: NewsForm
  ): Promise<NewsType | null> => {
    const inputData: NewsSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      category: formData.category ?? 'I',
      publishOn: formData.publishOn ?? localDate(),
      body: formData.body,
      imageFile: formData.imageFile,
    }
    const data = await update(contentId, inputData)
    return apitypeToNewsType(data ?? null)
  }

  return {
    loadNews: loadData,
    loadNewsList: loadList,
    getNews: get,
    getNewsList: getList,
    setNewsImageSettings,
    getNewsPreNextId: getPreNextId,
    createNews,
    updateNews,
    removeNews: remove,
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
  }

  const getList = async () => {
    await getNewsList(filter.value, sort.value, pager.value)
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

  const listQueries = useNewsListQueriesStore()
  const setListQueries = (queries: {
    filter: ListFilter
    sort: ListSort
    pager: ListPager
  }) => {
    listQueries.filter.value = queries.filter
    listQueries.sort.value = queries.sort
    listQueries.pager.value = queries.pager
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
    setListQueries,
  }
}

/**
 * news API アクションサービス
 * @param customerId
 */
export const useNewsActions = (customerId: Ref<number | null>) => {
  const { addSnackber } = useSnackbars()
  const {
    loadNews,
    getNews,
    setNewsImageSettings,
    getNewsPreNextId,
    createNews,
    updateNews,
    removeNews,
    newsRef,
    newsPreNextIdRefRef,
    updateNewsImageSettings,
    loading,
  } = useNewsContent(customerId)

  const { filter, sort } = useNewsListQueriesStore()

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

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!newsRef.value?.id) return

    const newSettings = setNewsImageSettings(settings)
    if (!newSettings) return

    updateNewsImageSettings(newsRef.value.id, newSettings)
  }

  return {
    newsRef,
    newsPreNextIdRefRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateImageSetting,
    loading,
  }
}
