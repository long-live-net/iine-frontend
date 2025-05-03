import { cloneDeep } from 'es-toolkit'
import type { ShopForm, ShopType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * Shop Form
 */
export const useShopForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const shopFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    titleSettings: () => true,
    caption: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '概要を入力してください'
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
  const shopFormInitial: ShopForm = {
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
    validationSchema: shopFormSchema,
    initialValues: shopFormInitial,
  })

  const formData = {
    title: useField<ShopForm['title']>('title'),
    titleSettings: useField<ShopForm['titleSettings']>('titleSettings'),
    caption: useField<ShopForm['caption']>('caption'),
    body: useField<ShopForm['body']>('body'),
    image: useField<ShopForm['image']>('image'),
    imageName: useField<ShopForm['imageName']>('imageName'),
    imageType: useField<ShopForm['imageType']>('imageType'),
    imageSettings: useField<ShopForm['imageSettings']>('imageSettings'),
    position: useField<ShopForm['position']>('position'),
  }

  const resetShopForm = (shopData?: ShopType | null) => {
    if (!shopData) return
    formData.title.value.value = shopData?.title ?? ''
    formData.titleSettings.value.value = cloneDeep(shopData.titleSettings)
    formData.caption.value.value = shopData?.caption ?? ''
    formData.body.value.value = shopData?.body ?? ''
    formData.image.value.value = shopData?.image?.url ?? ''
    formData.imageName.value.value = shopData?.image?.name ?? ''
    formData.imageType.value.value = shopData?.image?.type ?? ''
    formData.imageSettings.value.value = cloneDeep(shopData.imageSettings)
    formData.position.value.value = shopData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetShopForm,
  }
}
