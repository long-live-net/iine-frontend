import { cloneDeep } from 'es-toolkit'
import { useForm, useField } from 'vee-validate'
import type { ContactType, ContactForm } from '@/types/content'

/**
 * contact Form
 */
export const useContactForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const contactFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    subtitle: (v: string | undefined) =>
      maxLength(v, 50) || '50文字以内で入力してください',
    titleSettings: () => true,
    body: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '本文を入力してください'
      return true
    },
    image: () => true,
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
  }
  const contactFormInitial: ContactForm = {
    title: '',
    subtitle: '',
    titleSettings: getDefaultTitleSettings(),
    body: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: contactFormSchema,
    initialValues: contactFormInitial,
  })

  const formData = {
    title: useField<ContactForm['title']>('title'),
    subtitle: useField<ContactForm['subtitle']>('subtitle'),
    titleSettings: useField<ContactForm['titleSettings']>('titleSettings'),
    body: useField<ContactForm['body']>('body'),
    image: useField<ContactForm['image']>('image'),
    imageName: useField<ContactForm['imageName']>('imageName'),
    imageType: useField<ContactForm['imageType']>('imageType'),
    imageSettings: useField<ContactForm['imageSettings']>('imageSettings'),
  }

  const resetContactForm = (contactData?: ContactType | null) => {
    if (!contactData) return
    formData.title.value.value = contactData.title ?? ''
    formData.subtitle.value.value = contactData.subtitle ?? ''
    formData.titleSettings.value.value = cloneDeep(contactData.titleSettings)
    formData.body.value.value = contactData.body ?? ''
    formData.image.value.value = contactData.image?.url ?? ''
    formData.imageName.value.value = contactData.image?.name ?? ''
    formData.imageType.value.value = contactData.image?.type ?? ''
    formData.imageSettings.value.value = contactData.image?.settings
      ? cloneDeep(contactData.image.settings)
      : null
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetContactForm,
  }
}
