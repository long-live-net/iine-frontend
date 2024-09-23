import { useForm, useField } from 'vee-validate'
import type { EyecatchType, EyecatchForm } from '@/types/content'

/**
 * Eyecatch Form
 */
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
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
  }
  const eyecatchFormInitial: EyecatchForm = {
    title: '',
    subtitle: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: eyecatchFormSchema,
    initialValues: eyecatchFormInitial,
  })

  const formData = {
    title: useField<EyecatchForm['title']>('title'),
    subtitle: useField<EyecatchForm['subtitle']>('subtitle'),
    image: useField<EyecatchForm['image']>('image'),
    imageName: useField<EyecatchForm['imageName']>('imageName'),
    imageType: useField<EyecatchForm['imageType']>('imageType'),
    imageSettings: useField<EyecatchForm['imageSettings']>('imageSettings'),
  }

  const resetEyeCatchForm = (eyecatchData?: EyecatchType | null) => {
    if (!eyecatchData) return
    formData.title.value.value = eyecatchData.title
    formData.subtitle.value.value = eyecatchData.subtitle ?? ''
    formData.image.value.value = eyecatchData.image.url
    formData.imageName.value.value = eyecatchData.image.name
    formData.imageType.value.value = eyecatchData.image.type
    formData.imageSettings.value.value = eyecatchData.image.settings ?? null
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetEyeCatchForm,
  }
}
