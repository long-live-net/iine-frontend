import { useContentRead, useContentWrite } from '@/composables/use-content'
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

    console.log('contentDataRef.value.body', contentDataRef.value.body)

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
