import { useForm, useField } from 'vee-validate'
import type { NewsType, NewsForm } from '@/types/content'
import type {
  NewsGetApi,
  NewsSaveApi,
  ListFilter,
  ListSort,
  ListPager,
} from '@/types/content-api'

const apiUrl = '/newses'

export const useNewsRead = (customerId: number) => {
  const { get, getList, nextKey, contentDataRef, contentListRef } =
    useContentRead<NewsGetApi>(customerId, apiUrl)
  const loading = ref(false)

  const getNews = async (id?: number | null) => {
    try {
      loading.value = true
      await get(id)
    } finally {
      loading.value = false
    }
  }

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

  return {
    nextKey,
    getNews,
    getNewsList,
    newsRef,
    newsListRef,
    newsTotalRef,
    loading,
  }
}

export const useNewsWrite = (customerId: number) => {
  const { create, update, remove } = useContentWrite<NewsSaveApi, NewsGetApi>(
    customerId,
    apiUrl
  )
  const loading = ref(false)

  const createNews = async (formData: NewsForm): Promise<NewsType | null> => {
    const inputData: NewsSaveApi = {
      customerId,
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
      customerId,
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

  return {
    createNews,
    updateNews,
    removeNews,
    loading,
  }
}

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
      if (!maxLength(v, 1000)) return '1000文字以内で入力してください'
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

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetNewsForm,
  }
}
