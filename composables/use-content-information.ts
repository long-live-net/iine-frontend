import { useForm, useField } from 'vee-validate'
import type {
  InformationType,
  InformationForm,
  ImageSettings,
} from '@/types/content'
import type { InformationGetApi, InformationSaveApi } from '@/types/content-api'

const apiUrl = '/informations'

const useInformationRead = (customerId: Ref<number | null>) => {
  const { nextKey, get, setImageSettings, contentDataRef } =
    useContentRead<InformationGetApi>(customerId, apiUrl)

  const loading = ref(false)

  const informationRef = computed<InformationType | null>(() => {
    if (!contentDataRef.value) {
      return null
    }
    return {
      id: contentDataRef.value?.id,
      customerId: contentDataRef.value.customerId,
      title: contentDataRef.value.title,
      subtitle: contentDataRef.value.subtitle,
      body: contentDataRef.value.body,
      image: contentDataRef.value.image,
    }
  })

  const getInformation = async (id?: number | null) => {
    try {
      loading.value = true
      await get(id)
    } finally {
      loading.value = false
    }
  }

  const setInformationImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | void => {
    if (!informationRef.value) return
    if (!informationRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...informationRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  return {
    nextKey,
    getInformation,
    setInformationImageSettings,
    informationRef,
    loading,
  }
}

const useInformationWrite = (customerId: Ref<number | null>) => {
  const { create, update, remove, useUpdateImageSettings } = useContentWrite<
    InformationSaveApi,
    InformationGetApi
  >(customerId, apiUrl)
  const loading = ref(false)

  const createInformation = async (
    formData: InformationForm
  ): Promise<InformationType | null> => {
    const inputData: InformationSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
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
            subtitle: ret.value.subtitle,
            body: ret.value.body,
            image: ret.value.image,
          }
        : null
    } finally {
      loading.value = false
    }
  }

  const updateInformation = async (
    contentId: number,
    formData: InformationForm
  ): Promise<InformationType | null> => {
    const inputData: InformationSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
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
            subtitle: ret.value.subtitle,
            body: ret.value.body,
            image: ret.value.image,
          }
        : null
    } finally {
      loading.value = false
    }
  }
  const removeInformation = async (contentId: number) => {
    try {
      loading.value = true
      return await remove(contentId)
    } finally {
      loading.value = false
    }
  }

  const { debouncedFunc } = useUpdateImageSettings()
  const updateInformationImageSettings = async (
    contentId: number,
    imageSettings: ImageSettings
  ) => {
    debouncedFunc(contentId, imageSettings)
  }

  return {
    createInformation,
    updateInformation,
    removeInformation,
    updateInformationImageSettings,
    loading,
  }
}

/**
 * Information Form
 */
export const useInformationForm = () => {
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const informationFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    subtitle: (v: string | undefined) =>
      maxLength(v, 50) || '50文字以内で入力してください',
    body: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '本文を入力してください'
      if (!maxLength(v, 1000)) return '1000文字以内で入力してください'
      return true
    },
    image: () => true,
    imageFile: () => true,
  }
  const informationFormInitial: InformationForm = {
    title: '',
    subtitle: '',
    body: '',
    image: '',
    imageFile: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: informationFormSchema,
    initialValues: informationFormInitial,
  })

  const formData = {
    title: useField<InformationForm['title']>('title'),
    subtitle: useField<InformationForm['subtitle']>('subtitle'),
    body: useField<InformationForm['body']>('body'),
    image: useField<InformationForm['image']>('image'),
    imageFile: useField<InformationForm['imageFile']>('imageFile'),
  }

  const resetInformationForm = (informationData?: InformationType | null) => {
    if (!informationData) return
    formData.title.value.value = informationData?.title ?? ''
    formData.subtitle.value.value = informationData?.subtitle ?? ''
    formData.body.value.value = informationData?.body ?? ''
    formData.image.value.value = informationData?.image?.url ?? ''
    formData.imageFile.value.value = null
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
    resetInformationForm,
    changeImageFile,
  }
}

/**
 * Information API アクションサービス
 * @param customerId
 */
export const useInformationActions = (customerId: Ref<number | null>) => {
  const {
    nextKey,
    getInformation,
    setInformationImageSettings,
    informationRef,
    loading: readLoading,
  } = useInformationRead(customerId)

  const {
    createInformation,
    updateInformation,
    removeInformation,
    updateInformationImageSettings,
    loading: writeLoading,
  } = useInformationWrite(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async () => {
    await getInformation()
  }

  const onCreate = async (formData: InformationForm) => {
    const savedData = await createInformation(formData)
    addSnackber?.('Information を登録しました。')
    nextKey()
    getInformation(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: InformationForm
  }) => {
    if (!id) return

    const savedData = await updateInformation(id, formData)
    addSnackber?.('Information を更新しました。')
    nextKey()
    getInformation(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeInformation(id)
    addSnackber?.('Information を削除しました。')
    nextKey()
    getInformation()
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!informationRef.value?.id) return

    const newSettings = setInformationImageSettings(settings)
    if (!newSettings) return

    updateInformationImageSettings(informationRef.value.id, newSettings)
  }

  const loading = computed(() => readLoading.value || writeLoading.value)

  return {
    informationRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateImageSetting,
    loading,
  }
}
