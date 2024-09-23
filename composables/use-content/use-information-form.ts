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
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
  }
  const informationFormInitial: InformationForm = {
    title: '',
    subtitle: '',
    body: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
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
    imageName: useField<InformationForm['imageName']>('imageName'),
    imageType: useField<InformationForm['imageType']>('imageType'),
    imageSettings: useField<InformationForm['imageSettings']>('imageSettings'),
  }

  const resetInformationForm = (informationData?: InformationType | null) => {
    if (!informationData) return
    formData.title.value.value = informationData.title ?? ''
    formData.subtitle.value.value = informationData.subtitle ?? ''
    formData.body.value.value = informationData.body ?? ''
    formData.image.value.value = informationData.image?.url ?? ''
    formData.imageName.value.value = informationData.image?.name ?? ''
    formData.imageType.value.value = informationData.image?.type ?? ''
    formData.imageSettings.value.value = informationData.image?.settings ?? null
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetInformationForm,
  }
}
