import { useContentRead, useContentWrite } from '@/composables/use-content'
import type { ContactType, ContactForm } from '@/types/content'
import type { ContactGetApi, ContactSaveApi } from '@/types/content-api'

const apiUrl = '/contacts'

export const useContactRead = (customerId: number) => {
  const { get, nextKey, contentDataRef } = useContentRead<ContactGetApi>(
    customerId,
    apiUrl
  )
  const loading = ref(false)

  const getContact = async () => {
    try {
      loading.value = true
      await get()
    } finally {
      loading.value = false
    }
  }

  const contactRef = computed<ContactType | null>(() => {
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
    getContact,
    contactRef,
    loading,
  }
}

export const useContactWrite = (customerId: number) => {
  const { create, update } = useContentWrite<ContactSaveApi>(customerId, apiUrl)
  const loading = ref(false)

  const createContact = async (formData: ContactForm) => {
    const inputData: ContactSaveApi = {
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

  const updateContact = async (contentId: number, formData: ContactForm) => {
    const inputData: ContactSaveApi = {
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
    createContact,
    updateContact,
    loading,
  }
}
