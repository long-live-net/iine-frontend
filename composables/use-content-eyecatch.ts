import { useForm, useField } from 'vee-validate'
import type { EyecatchType, EyecatchForm } from '@/types/content'
import type { EyecatchGetApi, EyecatchSaveApi } from '@/types/content-api'

const apiUrl = '/eyecatches'

export const useEyecatchRead = (customerId: number) => {
  const { get, nextKey, contentDataRef } = useContentRead<EyecatchGetApi>(
    customerId,
    apiUrl
  )
  const loading = ref(false)

  const getEyecatch = async () => {
    try {
      loading.value = true
      await get()
    } finally {
      loading.value = false
    }
  }

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

  return {
    nextKey,
    getEyecatch,
    eyecatchRef,
    loading,
  }
}

export const useEyecatchWrite = (customerId: number) => {
  const { create, update } = useContentWrite<EyecatchSaveApi>(
    customerId,
    apiUrl
  )
  const loading = ref(false)

  const createEyecatch = async (formData: EyecatchForm) => {
    const inputData: EyecatchSaveApi = {
      customerId,
      title: formData.title,
      subtitle: formData.subtitle,
      imageFile: formData.imageFile,
    }
    try {
      loading.value = true
      return await create(inputData)
    } finally {
      loading.value = false
    }
  }

  const updateEyecatch = async (contentId: number, formData: EyecatchForm) => {
    const inputData: EyecatchSaveApi = {
      customerId,
      title: formData.title,
      subtitle: formData.subtitle,
      imageFile: formData.imageFile,
    }
    try {
      loading.value = true
      return await update(contentId, inputData)
    } finally {
      loading.value = false
    }
  }

  return {
    createEyecatch,
    updateEyecatch,
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
