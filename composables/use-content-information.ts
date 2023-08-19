import { useForm, useField } from 'vee-validate'
import type { InformationType, InformationForm } from '@/types/content'
import type { InformationGetApi, InformationSaveApi } from '@/types/content-api'

const apiUrl = '/informations'

export const useInformationRead = (customerId: number) => {
  const { get, nextKey, contentDataRef } = useContentRead<InformationGetApi>(
    customerId,
    apiUrl
  )
  const loading = ref(false)

  const getInformation = async () => {
    try {
      loading.value = true
      await get()
    } finally {
      loading.value = false
    }
  }

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

  return {
    nextKey,
    getInformation,
    informationRef,
    loading,
  }
}

export const useInformationWrite = (customerId: number) => {
  const { create, update } = useContentWrite<InformationSaveApi>(
    customerId,
    apiUrl
  )
  const loading = ref(false)

  const createInformation = async (formData: InformationForm) => {
    const inputData: InformationSaveApi = {
      customerId,
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      imageFile: formData.imageFile,
    }
    try {
      loading.value = true
      return await create(inputData)
    } finally {
      loading.value = false
    }
  }

  const updateInformation = async (
    contentId: number,
    formData: InformationForm
  ) => {
    const inputData: InformationSaveApi = {
      customerId,
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
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
    createInformation,
    updateInformation,
    loading,
  }
}

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

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetInformationForm,
  }
}
