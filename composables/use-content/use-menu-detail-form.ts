import { cloneDeep } from 'es-toolkit'
import type { MenuDetailForm, MenuDetailType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * menuDetail Form
 */
export const useMenuDetailForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { required, noBlank, maxLength } = useValidateRules()

  const menuDetailFormSchema = {
    menuId: (v: string | undefined) =>
      noBlank(v) || 'menuId を設定してください',
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
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
    isHilight: (v: boolean | undefined) =>
      required(v) || '注目するかどうかを設定してください',
    position: () => true,
  }
  const menuDetailFormInitial: MenuDetailForm = {
    menuId: '',
    title: '',
    titleSettings: getDefaultTitleSettings(),
    price: '',
    caption: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
    isHilight: false,
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: menuDetailFormSchema,
    initialValues: menuDetailFormInitial,
  })

  const formData = {
    menuId: useField<MenuDetailForm['menuId']>('menuId'),
    title: useField<MenuDetailForm['title']>('title'),
    titleSettings: useField<MenuDetailForm['titleSettings']>('titleSettings'),
    price: useField<MenuDetailForm['price']>('price'),
    caption: useField<MenuDetailForm['caption']>('caption'),
    image: useField<MenuDetailForm['image']>('image'),
    imageName: useField<MenuDetailForm['imageName']>('imageName'),
    imageType: useField<MenuDetailForm['imageType']>('imageType'),
    imageSettings: useField<MenuDetailForm['imageSettings']>('imageSettings'),
    isHilight: useField<MenuDetailForm['isHilight']>('isHilight'),
    position: useField<MenuDetailForm['position']>('position'),
  }

  const resetMenuDetailForm = (menuDetailData?: MenuDetailType | null) => {
    if (!menuDetailData) return
    formData.menuId.value.value = menuDetailData?.menuId ?? ''
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
    formData.isHilight.value.value = menuDetailData?.isHilight ?? false
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
