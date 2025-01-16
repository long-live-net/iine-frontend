import { cloneDeep } from 'es-toolkit'
import type { FeatureForm, FeatureType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * feature Form
 */
export const useFeatureForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const featureFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    titleSettings: () => true,
    caption: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '紹介文を入力してください'
      if (!maxLength(v, 400)) return '400文字以内で入力してください'
      return true
    },
    image: (v: string | undefined) =>
      noBlank(v) || 'タイトル画像ファイルを設定してください',
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
    body: () => true,
    position: () => true,
  }
  const featureFormInitial: FeatureForm = {
    title: '',
    titleSettings: getDefaultTitleSettings(),
    caption: '',
    body: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: featureFormSchema,
    initialValues: featureFormInitial,
  })

  const formData = {
    title: useField<FeatureForm['title']>('title'),
    titleSettings: useField<FeatureForm['titleSettings']>('titleSettings'),
    caption: useField<FeatureForm['caption']>('caption'),
    body: useField<FeatureForm['body']>('body'),
    image: useField<FeatureForm['image']>('image'),
    imageName: useField<FeatureForm['imageName']>('imageName'),
    imageType: useField<FeatureForm['imageType']>('imageType'),
    imageSettings: useField<FeatureForm['imageSettings']>('imageSettings'),
    position: useField<FeatureForm['position']>('position'),
  }

  const resetFeatureForm = (featureData?: FeatureType | null) => {
    if (!featureData) return
    formData.title.value.value = featureData?.title ?? ''
    formData.titleSettings.value.value = cloneDeep(featureData.titleSettings)
    formData.caption.value.value = featureData?.caption ?? ''
    formData.body.value.value = featureData?.body ?? ''
    formData.image.value.value = featureData?.image?.url ?? ''
    formData.imageName.value.value = featureData?.image?.name ?? ''
    formData.imageType.value.value = featureData?.image?.type ?? ''
    formData.imageSettings.value.value = featureData.imageSettings
      ? cloneDeep(featureData.imageSettings)
      : null
    formData.position.value.value = featureData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetFeatureForm,
  }
}
