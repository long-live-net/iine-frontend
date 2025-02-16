import { cloneDeep } from 'es-toolkit'
import type { MenuDetailForm, MenuDetailType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * menuDetail Form
 */
export const useMenuDetailForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength } = useValidateRules()

  const menuDetailFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'メニュー名を入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    titleSettings: () => true,
    price: (v: string | undefined) =>
      maxLength(v, 100) || '100文字以内で入力してください',
    caption: (v: string | undefined) =>
      maxLength(v, 400) || '400文字以内で入力してください',
    image: () => true,
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
    isHilight: () => true,
    position: () => true,
  }
  const menuDetailFormInitial: MenuDetailForm = {
    isHilight: false,
    title: '',
    titleSettings: getDefaultTitleSettings(),
    price: '',
    caption: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: menuDetailFormSchema,
    initialValues: menuDetailFormInitial,
  })

  const formData = {
    isHilight: useField<MenuDetailForm['isHilight']>('isHilight'),
    title: useField<MenuDetailForm['title']>('title'),
    titleSettings: useField<MenuDetailForm['titleSettings']>('titleSettings'),
    price: useField<MenuDetailForm['price']>('price'),
    caption: useField<MenuDetailForm['caption']>('caption'),
    image: useField<MenuDetailForm['image']>('image'),
    imageName: useField<MenuDetailForm['imageName']>('imageName'),
    imageType: useField<MenuDetailForm['imageType']>('imageType'),
    imageSettings: useField<MenuDetailForm['imageSettings']>('imageSettings'),
    position: useField<MenuDetailForm['position']>('position'),
  }

  const resetMenuDetailForm = (menuDetailData?: MenuDetailType | null) => {
    if (!menuDetailData) return
    formData.isHilight.value.value = menuDetailData?.isHilight
    formData.title.value.value = menuDetailData?.title ?? ''
    formData.titleSettings.value.value = cloneDeep(menuDetailData.titleSettings)
    formData.price.value.value = menuDetailData?.price ?? ''
    formData.caption.value.value = menuDetailData?.caption ?? ''
    formData.image.value.value = menuDetailData?.image?.url ?? ''
    formData.imageName.value.value = menuDetailData?.image?.name ?? ''
    formData.imageType.value.value = menuDetailData?.image?.type ?? ''
    formData.imageSettings.value.value = menuDetailData.imageSettings
      ? cloneDeep(menuDetailData.imageSettings)
      : null
    formData.position.value.value = menuDetailData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetMenuDetailForm,
  }
}
