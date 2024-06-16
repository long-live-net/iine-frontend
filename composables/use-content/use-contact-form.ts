import { useForm, useField } from 'vee-validate'
import type { ContactType, ContactForm } from '@/types/content'

/**
 * contact Form
 */
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

  const changeImageFile = async (params: { file: File; url: string }) => {
    formData.image.value.value = params.url
    formData.imageFile.value.value = params.file
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetContactForm,
    changeImageFile,
  }
}
