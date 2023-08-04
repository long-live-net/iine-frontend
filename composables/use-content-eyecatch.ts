import { useContentRead, useContentWrite } from '@/composables/use-content'
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
