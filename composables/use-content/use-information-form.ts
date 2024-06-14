import { useForm, useField } from 'vee-validate'
import type { InformationType, InformationForm } from '@/types/content'

/**
 * Information Form
 */
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

  const changeImageFile = (params: { file: File; url: string }) => {
    formData.image.value.value = params.url
    formData.imageFile.value.value = params.file
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetInformationForm,
    changeImageFile,
  }
}
