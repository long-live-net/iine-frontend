import { useForm, useField } from 'vee-validate'
import type { EyecatchType, EyecatchForm, ImageSettings } from '@/types/content'
import type { EyecatchGetApi, EyecatchSaveApi } from '@/types/content-api'

const apiUrl = '/eyecatches'

export const useEyecatchRead = (customerId: number) => {
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

export const useEyecatchWrite = (customerId: number) => {
  const { create, update, remove, updateImageSettings } = useContentWrite<
    EyecatchSaveApi,
    EyecatchGetApi
  >(customerId, apiUrl)
  const loading = ref(false)

  const createEyecatch = async (
    formData: EyecatchForm
  ): Promise<EyecatchType | null> => {
    const inputData: EyecatchSaveApi = {
      customerId,
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
      customerId,
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

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetEyeCatchForm,
  }
}
