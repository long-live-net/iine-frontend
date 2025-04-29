import { cloneDeep } from 'es-toolkit'
import type { MenuForm, MenuType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * menu Form
 */
export const useMenuForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const menuFormSchema = {
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
    position: () => true,
  }
  const menuFormInitial: MenuForm = {
    title: '',
    titleSettings: getDefaultTitleSettings(),
    caption: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: menuFormSchema,
    initialValues: menuFormInitial,
  })

  const formData = {
    title: useField<MenuForm['title']>('title'),
    titleSettings: useField<MenuForm['titleSettings']>('titleSettings'),
    caption: useField<MenuForm['caption']>('caption'),
    image: useField<MenuForm['image']>('image'),
    imageName: useField<MenuForm['imageName']>('imageName'),
    imageType: useField<MenuForm['imageType']>('imageType'),
    imageSettings: useField<MenuForm['imageSettings']>('imageSettings'),
    position: useField<MenuForm['position']>('position'),
  }

  const resetMenuForm = (menuData?: MenuType | null) => {
    if (!menuData) return
    formData.title.value.value = menuData?.title ?? ''
    formData.titleSettings.value.value = cloneDeep(menuData.titleSettings)
    formData.caption.value.value = menuData?.caption ?? ''
    formData.image.value.value = menuData?.image?.url ?? ''
    formData.imageName.value.value = menuData?.image?.name ?? ''
    formData.imageType.value.value = menuData?.image?.type ?? ''
    formData.imageSettings.value.value = menuData.imageSettings
      ? cloneDeep(menuData.imageSettings)
      : null
    formData.position.value.value = menuData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetMenuForm,
  }
}
