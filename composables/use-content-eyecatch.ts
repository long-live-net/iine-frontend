import { useForm, useField } from 'vee-validate'
import type { EyecatchType, EyecatchForm, ImageSettings } from '@/types/content'
import type { EyecatchGetApi, EyecatchSaveApi } from '@/types/content-api'

const apiUrl = '/eyecatches'

const useEyecatchRead = (customerId: Ref<number | null>) => {
  const { nextKey, get, setImageSettings, contentDataRef } =
    useContentRead<EyecatchGetApi>(customerId, apiUrl)

  const loading = ref(false)

  const eyecatchRef = computed<EyecatchType | null>(() => {
    if (!contentDataRef.value) {
      return null
    }
    return {
      id: contentDataRef.value?.id,
      customerId: contentDataRef.value.customerId,
      title: contentDataRef.value.title,
      subtitle: contentDataRef.value.subtitle,
      image: contentDataRef.value.image,
    }
  })

  const getEyecatch = async (id?: number | null) => {
    try {
      loading.value = true
      await get(id)
    } finally {
      loading.value = false
    }
  }

  const setEyecatchImageSettings = (settings: Partial<ImageSettings>) => {
    if (!eyecatchRef.value) return
    if (!eyecatchRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...eyecatchRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  return {
    nextKey,
    getEyecatch,
    setEyecatchImageSettings,
    eyecatchRef,
    loading,
  }
}

const useEyecatchWrite = (customerId: Ref<number | null>) => {
  const { create, update, remove, updateImageSettings } = useContentWrite<
    EyecatchSaveApi,
    EyecatchGetApi
  >(customerId, apiUrl)
  const loading = ref(false)

  const createEyecatch = async (
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
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
            image: ret.value.image,
          }
        : null
    } finally {
      loading.value = false
    }
  }

  const updateEyecatch = async (
    contentId: number,
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = {
      customerId: customerId.value ?? 0,
      title: formData.title,
      subtitle: formData.subtitle,
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
            image: ret.value.image,
          }
        : null
    } finally {
      loading.value = false
    }
  }

  const removeEyecatch = async (contentId: number) => {
    try {
      loading.value = true
      return await remove(contentId)
    } finally {
      loading.value = false
    }
  }

  const updateEyecatchImageSettings = async (
    contentId: number,
    imageSettings: ImageSettings
  ) => {
    const promise = updateImageSettings(contentId, imageSettings)
    if (promise) {
      return await promise
    }
  }

  return {
    createEyecatch,
    updateEyecatch,
    removeEyecatch,
    updateEyecatchImageSettings,
    loading,
  }
}

/**
 * Eyecatch Form
 */
export const useEyecatchForm = () => {
  const { noBlank, maxLength } = useValidateRules()
  const eyecatchFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'トップタイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    subtitle: (v: string | undefined) =>
      maxLength(v, 50) || '50文字以内で入力してください',
    image: (v: string | undefined) =>
      noBlank(v) || 'トップ背景画像ファイルを設定してください',
    imageFile: () => true,
  }
  const eyecatchFormInitial: EyecatchForm = {
    title: '',
    subtitle: '',
    image: '',
    imageFile: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: eyecatchFormSchema,
    initialValues: eyecatchFormInitial,
  })

  const formData = {
    title: useField<EyecatchForm['title']>('title'),
    subtitle: useField<EyecatchForm['subtitle']>('subtitle'),
    image: useField<EyecatchForm['image']>('image'),
    imageFile: useField<EyecatchForm['imageFile']>('imageFile'),
  }

  const resetEyeCatchForm = (eyecatchData?: EyecatchType | null) => {
    if (!eyecatchData) return
    formData.title.value.value = eyecatchData?.title ?? ''
    formData.subtitle.value.value = eyecatchData?.subtitle ?? ''
    formData.image.value.value = eyecatchData?.image?.url ?? ''
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
    resetEyeCatchForm,
    changeImageFile,
  }
}

/**
 * Eyecatch API アクションサービス
 * @param customerId
 */
export const useEyecatchActions = (customerId: Ref<number | null>) => {
  const {
    nextKey,
    getEyecatch,
    setEyecatchImageSettings,
    eyecatchRef,
    loading: readLoading,
  } = useEyecatchRead(customerId)

  const {
    createEyecatch,
    updateEyecatch,
    removeEyecatch,
    updateEyecatchImageSettings,
    loading: writeLoading,
  } = useEyecatchWrite(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async () => {
    await getEyecatch()
  }

  const onCreate = async (formData: EyecatchForm) => {
    const savedData = await createEyecatch(formData)
    addSnackber?.('トップ画像を登録しました。')
    nextKey()
    getEyecatch(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: EyecatchForm
  }) => {
    if (!id) return

    const savedData = await updateEyecatch(id, formData)
    addSnackber?.('トップ画像を更新しました。')
    nextKey()
    getEyecatch(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeEyecatch(id)
    addSnackber?.('トップ画像を削除しました。')
    nextKey()
    getEyecatch()
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!eyecatchRef.value?.id) return

    const newSettings = setEyecatchImageSettings(settings)
    if (!newSettings) return

    updateEyecatchImageSettings(eyecatchRef.value.id, newSettings)
  }

  const loading = computed(() => readLoading.value || writeLoading.value)

  return {
    eyecatchRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateImageSetting,
    loading,
  }
}
