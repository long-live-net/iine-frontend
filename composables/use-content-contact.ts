import { useForm, useField } from 'vee-validate'
import type { ContactType, ContactForm, ImageSettings } from '@/types/content'
import type { ContactGetApi, ContactSaveApi } from '@/types/content-api'

const apiUrl = '/contacts'

export const useContactRead = (customerId: number) => {
  const { nextKey, get, setImageSettings, contentDataRef } =
    useContentRead<ContactGetApi>(customerId, apiUrl)

  const loading = ref(false)

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

  const getContact = async (id?: number | null) => {
    try {
      loading.value = true
      await get(id)
    } finally {
      loading.value = false
    }
  }

  const setContactImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | void => {
    if (!contactRef.value) return
    if (!contactRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...contactRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  return {
    nextKey,
    getContact,
    setContactImageSettings,
    contactRef,
    loading,
  }
}

export const useContactWrite = (customerId: number) => {
  const { create, update, remove, updateImageSettings } = useContentWrite<
    ContactSaveApi,
    ContactGetApi
  >(customerId, apiUrl)
  const loading = ref(false)

  const createContact = async (
    formData: ContactForm
  ): Promise<ContactType | null> => {
    const inputData: ContactSaveApi = {
      customerId,
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

  const updateContact = async (
    contentId: number,
    formData: ContactForm
  ): Promise<ContactType | null> => {
    const inputData: ContactSaveApi = {
      customerId,
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

  const removeContact = async (contentId: number) => {
    try {
      loading.value = true
      return await remove(contentId)
    } finally {
      loading.value = false
    }
  }

  const updateContactImageSettings = async (
    contentId: number,
    imageSettings: ImageSettings
  ) => {
    const promise = updateImageSettings(contentId, imageSettings)
    if (promise) {
      return await promise
    }
  }

  return {
    createContact,
    updateContact,
    removeContact,
    updateContactImageSettings,
    loading,
  }
}

export const useContactForm = () => {
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const contactFormSchema = {
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
  const contactFormInitial: ContactForm = {
    title: '',
    subtitle: '',
    body: '',
    image: '',
    imageFile: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: contactFormSchema,
    initialValues: contactFormInitial,
  })

  const formData = {
    title: useField<ContactForm['title']>('title'),
    subtitle: useField<ContactForm['subtitle']>('subtitle'),
    body: useField<ContactForm['body']>('body'),
    image: useField<ContactForm['image']>('image'),
    imageFile: useField<ContactForm['imageFile']>('imageFile'),
  }

  const resetContactForm = (contactData?: ContactType | null) => {
    if (!contactData) return
    formData.title.value.value = contactData?.title ?? ''
    formData.subtitle.value.value = contactData?.subtitle ?? ''
    formData.body.value.value = contactData?.body ?? ''
    formData.image.value.value = contactData?.image?.url ?? ''
    formData.imageFile.value.value = null
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetContactForm,
  }
}
