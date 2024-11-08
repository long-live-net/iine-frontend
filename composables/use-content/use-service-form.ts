import { cloneDeep } from 'es-toolkit'
import type { ServiceForm, ServiceType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * service Form
 */
export const useServiceForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const serviceFormSchema = {
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
  const serviceFormInitial: ServiceForm = {
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
    validationSchema: serviceFormSchema,
    initialValues: serviceFormInitial,
  })

  const formData = {
    title: useField<ServiceForm['title']>('title'),
    titleSettings: useField<ServiceForm['titleSettings']>('titleSettings'),
    caption: useField<ServiceForm['caption']>('caption'),
    body: useField<ServiceForm['body']>('body'),
    image: useField<ServiceForm['image']>('image'),
    imageName: useField<ServiceForm['imageName']>('imageName'),
    imageType: useField<ServiceForm['imageType']>('imageType'),
    imageSettings: useField<ServiceForm['imageSettings']>('imageSettings'),
    position: useField<ServiceForm['position']>('position'),
  }

  const resetServiceForm = (serviceData?: ServiceType | null) => {
    if (!serviceData) return
    formData.title.value.value = serviceData?.title ?? ''
    formData.titleSettings.value.value = cloneDeep(serviceData.titleSettings)
    formData.caption.value.value = serviceData?.caption ?? ''
    formData.body.value.value = serviceData?.body ?? ''
    formData.image.value.value = serviceData?.image?.url ?? ''
    formData.imageName.value.value = serviceData?.image?.name ?? ''
    formData.imageType.value.value = serviceData?.image?.type ?? ''
    formData.imageSettings.value.value = serviceData.image?.settings
      ? cloneDeep(serviceData.image.settings)
      : null
    formData.position.value.value = serviceData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetServiceForm,
  }
}
