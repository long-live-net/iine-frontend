import { cloneDeep } from 'es-toolkit'
import type { MenuImageForm, MenuImageType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * menuImage Form
 */
export const useMenuImageForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const menuImageFormSchema = {
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
    position: () => true,
    menuImageUrl: (v: string | undefined) =>
      noBlank(v) || 'メニュー用ファイルを設定してください',
    menuImageName: () => true,
    menuImageType: () => true,
  }
  const menuImageFormInitial: MenuImageForm = {
    title: '',
    titleSettings: getDefaultTitleSettings(),
    caption: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
    position: 0,
    menuImageUrl: '',
    menuImageName: '',
    menuImageType: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: menuImageFormSchema,
    initialValues: menuImageFormInitial,
  })

  const formData = {
    title: useField<MenuImageForm['title']>('title'),
    titleSettings: useField<MenuImageForm['titleSettings']>('titleSettings'),
    caption: useField<MenuImageForm['caption']>('caption'),
    image: useField<MenuImageForm['image']>('image'),
    imageName: useField<MenuImageForm['imageName']>('imageName'),
    imageType: useField<MenuImageForm['imageType']>('imageType'),
    imageSettings: useField<MenuImageForm['imageSettings']>('imageSettings'),
    position: useField<MenuImageForm['position']>('position'),
    menuImageUrl: useField<MenuImageForm['menuImageUrl']>('menuImageUrl'),
    menuImageName: useField<MenuImageForm['menuImageName']>('menuImageName'),
    menuImageType: useField<MenuImageForm['menuImageType']>('menuImageType'),
  }

  const resetMenuImageForm = (menuImageData?: MenuImageType | null) => {
    if (!menuImageData) return
    formData.title.value.value = menuImageData.title ?? ''
    formData.titleSettings.value.value = cloneDeep(menuImageData.titleSettings)
    formData.caption.value.value = menuImageData.caption ?? ''
    formData.image.value.value = menuImageData.image?.url ?? ''
    formData.imageName.value.value = menuImageData.image?.name ?? ''
    formData.imageType.value.value = menuImageData.image?.type ?? ''
    formData.imageSettings.value.value = menuImageData.image?.settings
      ? cloneDeep(menuImageData.image.settings)
      : null
    formData.position.value.value = menuImageData.position ?? 0
    formData.menuImageUrl.value.value = menuImageData.menuImage.url ?? ''
    formData.menuImageName.value.value = menuImageData.menuImage.name ?? ''
    formData.menuImageType.value.value = menuImageData.menuImage.type ?? ''
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetMenuImageForm,
  }
}
