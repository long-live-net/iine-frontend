import { useForm, useField } from 'vee-validate'
import type {
  NewsType,
  NewsForm,
  ImageSettings,
  ContentPreNextId,
} from '@/types/content'
import type {
  NewsGetApi,
  NewsSaveApi,
  ListFilter,
  ListSort,
  ListPager,
} from '@/types/content-api'

const apiUrl = '/newses'

const useNewsRead = (customerId: Ref<number | null>) => {
  const {
    nextKey,
    get,
    getList,
    setImageSettings,
    getPreNextId,
    contentDataRef,
    contentListRef,
    preNextIdRef,
  } = useContentRead<NewsGetApi>(customerId, apiUrl)
  const loading = ref(false)
  const newsRef = computed<NewsType | null>(() => {
    if (!contentDataRef.value) {
      return null
    }
    return {
      id: contentDataRef.value.id,
      customerId: contentDataRef.value.customerId,
      title: contentDataRef.value.title,
      category: contentDataRef.value.category,
      publishOn: contentDataRef.value.publishOn,
      body: contentDataRef.value.body,
      image: contentDataRef.value.image,
    }
  })

  const getNews = async (id?: number | null) => {
    try {
      loading.value = true
      await get(id)
    } finally {
      loading.value = false
    }
  }

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

  const newsListRef = computed<NewsType[] | null>(() => {
    if (!contentListRef.value) {
      return null
    }
    return (
      contentListRef.value.list?.map((n) => ({
        id: n.id,
        customerId: n.customerId,
        title: n.title,
        category: n.category,
        publishOn: n.publishOn,
        body: n.body,
        image: n.image,
      })) ?? null
    )
  })

  const newsTotalRef = computed<number | null>(() => {
    if (!contentListRef.value) {
      return null
    }
    return contentListRef.value.total
  })

  const getNewsList = async (
    filter: ListFilter,
    sort: ListSort,
    pager: ListPager
  ) => {
    try {
      loading.value = true
      await getList(filter, sort, pager)
    } finally {
      loading.value = false
    }
  }

  const newsPreNextIdRefRef = computed<ContentPreNextId | null>(
    () => preNextIdRef.value
  )
  const getNewsPreNextId = async (
    currentId: number,
    filter: ListFilter,
    sort: ListSort
  ) => {
    try {
      loading.value = true
      await getPreNextId(currentId, filter, sort)
    } finally {
      loading.value = false
    }
  }

  return {
    nextKey,
    getNews,
    getNewsList,
    setNewsImageSettings,
    getNewsPreNextId,
    newsRef,
    newsListRef,
    newsTotalRef,
    newsPreNextIdRefRef,
    loading,
  }
}

const useNewsWrite = (customerId: Ref<number | null>) => {
  const { create, update, remove, useUpdateImageSettings } = useContentWrite<
    NewsSaveApi,
    NewsGetApi
  >(customerId, apiUrl)
  const loading = ref(false)

  const createNews = async (formData: NewsForm): Promise<NewsType | null> => {
    const inputData: NewsSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      category: formData.category ?? 'I',
      publishOn: formData.publishOn ?? localDate(),
      body: formData.body,
      imageFile: formData.imageFile,
    }
    try {
      loading.value = true
      const ret = await create(inputData)
      return ret.value
        ? {
            id: ret.value.id,
            customerId: ret.value.customerId,
            title: ret.value.title,
            category: ret.value.category,
            publishOn: ret.value.publishOn,
            body: ret.value.body,
            image: ret.value.image,
          }
        : null
    } finally {
      loading.value = false
    }
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
    try {
      loading.value = true
      const ret = await update(contentId, inputData)
      return ret.value
        ? {
            id: ret.value.id,
            customerId: ret.value.customerId,
            title: ret.value.title,
            category: ret.value.category,
            publishOn: ret.value.publishOn,
            body: ret.value.body,
            image: ret.value.image,
          }
        : null
    } finally {
      loading.value = false
    }
  }

  const removeNews = async (contentId: number) => {
    try {
      loading.value = true
      return await remove(contentId)
    } finally {
      loading.value = false
    }
  }

  const { debouncedFunc } = useUpdateImageSettings()
  const updateNewsImageSettings = async (
    contentId: number,
    imageSettings: ImageSettings
  ) => {
    debouncedFunc(contentId, imageSettings)
  }

  return {
    createNews,
    updateNews,
    removeNews,
    updateNewsImageSettings,
    loading,
  }
}

/**
 * news Form
 */
export const useNewsForm = () => {
  const { required, noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const newsFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    category: (v: string | null) => noBlank(v) || 'カテゴリを入力してください',
    publishOn: (v: Date | null) => required(v) || '公開日を入力してください',
    body: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '本文を入力してください'
      return true
    },
    image: () => true,
    imageFile: () => true,
  }
  const newsFormInitial: NewsForm = {
    title: '',
    category: null,
    publishOn: null,
    body: '',
    image: '',
    imageFile: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: newsFormSchema,
    initialValues: newsFormInitial,
  })

  const formData = {
    title: useField<NewsForm['title']>('title'),
    category: useField<NewsForm['category']>('category'),
    publishOn: useField<NewsForm['publishOn']>('publishOn'),
    body: useField<NewsForm['body']>('body'),
    image: useField<NewsForm['image']>('image'),
    imageFile: useField<NewsForm['imageFile']>('imageFile'),
  }

  const resetNewsForm = (newsData?: NewsType | null) => {
    if (!newsData) return
    formData.title.value.value = newsData?.title ?? ''
    formData.category.value.value = newsData?.category ?? null
    formData.publishOn.value.value = newsData?.publishOn ?? null
    formData.body.value.value = newsData?.body ?? ''
    formData.image.value.value = newsData?.image?.url ?? ''
    formData.imageFile.value.value = null
  }

  const changeImageFile = async (params: { file: File; url: string }) => {
    formData.image.value.value = params.url
    formData.imageFile.value.value = params.file
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetNewsForm,
    changeImageFile,
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
  const {
    nextKey,
    getNewsList,
    newsListRef,
    newsTotalRef,
    loading: readLoading,
  } = useNewsRead(customerId)
  const {
    createNews,
    updateNews,
    removeNews,
    loading: writeLoading,
  } = useNewsWrite(customerId)
  const { addSnackber } = useSnackbars()

  const loading = computed(() => readLoading.value || writeLoading.value)

  const onLoad = async () => {
    await getNewsList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (formData: NewsForm) => {
    await createNews(formData)
    addSnackber?.('News を登録しました。')
    nextKey()
    getNewsList(filter.value, sort.value, pager.value)
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
    nextKey()
    getNewsList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: number) => {
    await removeNews(id)
    addSnackber?.('News を削除しました。')
    nextKey()
    getNewsList(filter.value, sort.value, pager.value)
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
  const {
    nextKey,
    getNews,
    setNewsImageSettings,
    getNewsPreNextId,
    newsRef,
    newsPreNextIdRefRef,
    loading: readLoading,
  } = useNewsRead(customerId)

  const {
    createNews,
    updateNews,
    removeNews,
    updateNewsImageSettings,
    loading: writeLoading,
  } = useNewsWrite(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async (id?: number) => {
    await getNews(id)
  }

  const onCreate = async (formData: NewsForm) => {
    const savedData = await createNews(formData)
    addSnackber?.('News を登録しました。')
    nextKey()
    getNews(savedData?.id)
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
    nextKey()
    getNews(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeNews(id)
    addSnackber?.('News を削除しました。')
    nextKey()
    getNews()
  }

  const { filter, sort } = useNewsListQueriesStore()
  watch(newsRef, () => {
    if (newsRef.value) {
      getNewsPreNextId(newsRef.value.id, filter.value, sort.value)
    }
  })

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!newsRef.value?.id) return

    const newSettings = setNewsImageSettings(settings)
    if (!newSettings) return

    updateNewsImageSettings(newsRef.value.id, newSettings)
  }

  const loading = computed(() => readLoading.value || writeLoading.value)

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
