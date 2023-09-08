import type { ServiceForm, ServiceType } from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  ServiceGetApi,
  ServiceSaveApi,
  ContentPosition,
} from '@/types/content-api'
import { useField, useForm } from 'vee-validate'

const apiUrl = '/services'

const useServiceRead = (customerId: Ref<number | null>) => {
  const {
    nextKey,
    get,
    getList,
    setListPositions,
    contentDataRef,
    contentListRef,
  } = useContentRead<ServiceGetApi>(customerId, apiUrl)
  const loading = ref(false)

  const getService = async (id?: number | null) => {
    try {
      loading.value = true
      await get(id)
    } finally {
      loading.value = false
    }
  }

  const serviceRef = computed<ServiceType | null>(() => {
    if (!contentDataRef.value) {
      return null
    }
    return {
      id: contentDataRef.value.id,
      customerId: contentDataRef.value.customerId,
      title: contentDataRef.value.title,
      caption: contentDataRef.value.caption,
      body: contentDataRef.value.body,
      image: contentDataRef.value.image,
      position: contentDataRef.value.position,
    }
  })

  const getServiceList = async (
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

  const serviceListRef = computed<ServiceType[] | null>(() => {
    if (!contentListRef.value) {
      return null
    }
    return (
      contentListRef.value.list?.map((n) => ({
        id: n.id,
        customerId: n.customerId,
        title: n.title,
        caption: n.caption,
        body: n.body,
        image: n.image,
        position: n.position,
      })) ?? null
    )
  })

  const serviceTotalRef = computed<number | null>(() => {
    if (!contentListRef.value) {
      return null
    }
    return contentListRef.value.total
  })

  const setServiceListPositions = (
    serviceList: ServiceType[]
  ): ContentPosition[] => {
    const positions: ContentPosition[] = serviceList.map(
      (d, i) => ({ id: d.id, position: i + 1 }) as ContentPosition
    )
    setListPositions(positions)
    return positions
  }

  return {
    nextKey,
    getService,
    getServiceList,
    setServiceListPositions,
    serviceRef,
    serviceListRef,
    serviceTotalRef,
    loading,
  }
}

const useServiceWrite = (customerId: Ref<number | null>) => {
  const { create, update, remove, updatePositions } = useContentWrite<
    ServiceSaveApi,
    ServiceGetApi
  >(customerId, apiUrl)
  const loading = ref(false)

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
    try {
      loading.value = true
      const ret = await create(inputData)
      return ret.value
        ? {
            id: ret.value.id,
            customerId: ret.value.customerId,
            title: ret.value.title,
            caption: ret.value.caption,
            body: ret.value.body,
            image: ret.value.image,
            position: ret.value.position,
          }
        : null
    } finally {
      loading.value = false
    }
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
    try {
      loading.value = true
      const ret = await update(contentId, inputData)
      return ret.value
        ? {
            id: ret.value.id,
            customerId: ret.value.customerId,
            title: ret.value.title,
            caption: ret.value.caption,
            body: ret.value.body,
            image: ret.value.image,
            position: ret.value.position,
          }
        : null
    } finally {
      loading.value = false
    }
  }

  const removeService = async (contentId: number) => {
    try {
      loading.value = true
      return await remove(contentId)
    } finally {
      loading.value = false
    }
  }

  const updateServiceListPositions = async (positions: ContentPosition[]) => {
    try {
      loading.value = true
      await updatePositions(positions)
    } finally {
      loading.value = false
    }
  }

  return {
    createService,
    updateService,
    removeService,
    updateServiceListPositions,
    loading,
  }
}

/**
 * service Form
 */
export const useServiceForm = () => {
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const serviceFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    caption: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '紹介文を入力してください'
      if (!maxLength(v, 400)) return '400文字以内で入力してください'
      return true
    },
    body: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '本文を入力してください'
      if (!maxLength(v, 1000)) return '1000文字以内で入力してください'
      return true
    },
    image: (v: string | undefined) =>
      noBlank(v) || 'タイトル画像ファイルを設定してください',
    imageFile: () => true,
    position: () => true,
  }
  const serviceFormInitial: ServiceForm = {
    title: '',
    caption: '',
    body: '',
    image: '',
    imageFile: null,
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: serviceFormSchema,
    initialValues: serviceFormInitial,
  })

  const formData = {
    title: useField<ServiceForm['title']>('title'),
    caption: useField<ServiceForm['caption']>('caption'),
    body: useField<ServiceForm['body']>('body'),
    image: useField<ServiceForm['image']>('image'),
    imageFile: useField<ServiceForm['imageFile']>('imageFile'),
    position: useField<ServiceForm['position']>('position'),
  }

  const resetServiceForm = (serviceData?: ServiceType | null) => {
    if (!serviceData) return
    formData.title.value.value = serviceData?.title ?? ''
    formData.caption.value.value = serviceData?.caption ?? ''
    formData.body.value.value = serviceData?.body ?? ''
    formData.image.value.value = serviceData?.image?.url ?? ''
    formData.imageFile.value.value = null
    formData.position.value.value = serviceData?.position ?? 0
  }

  const changeImageFile = (params: { file: File; url: string }) => {
    formData.image.value.value = params.url
    formData.imageFile.value.value = params.file
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetServiceForm,
    changeImageFile,
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
    nextKey,
    getServiceList,
    setServiceListPositions,
    serviceListRef,
    loading: readLoading,
  } = useServiceRead(customerId)

  const {
    createService,
    updateService,
    removeService,
    updateServiceListPositions,
    loading: writeLoading,
  } = useServiceWrite(customerId)

  const onLoad = async () => {
    await getServiceList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (formData: ServiceForm) => {
    await createService(formData)
    nextKey()
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
    nextKey()
    getServiceList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: number) => {
    await removeService(id)
    nextKey()
    getServiceList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (services: ServiceType[]) => {
    await updateServiceListPositions(setServiceListPositions(services))
    nextKey()
    getServiceList(filter.value, sort.value, pager.value)
  }

  const loading = computed(() => readLoading.value || writeLoading.value)

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
