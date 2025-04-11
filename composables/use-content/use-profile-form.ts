import { cloneDeep } from 'es-toolkit'
import { useForm, useField } from 'vee-validate'
import type { ProfileType, ProfileForm } from '@/types/content'

/**
 * Profile Form
 */
export const useProfileForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const profileFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    subtitle: (v: string | undefined) =>
      maxLength(v, 50) || '50文字以内で入力してください',
    titleSettings: () => true,
    captionBody: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '概要を入力してください'
      return true
    },
    body: () => true,
    image: () => true,
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
  }
  const profileFormInitial: ProfileForm = {
    title: '',
    subtitle: '',
    titleSettings: getDefaultTitleSettings(),
    captionBody: '',
    body: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: profileFormSchema,
    initialValues: profileFormInitial,
  })

  const formData = {
    title: useField<ProfileForm['title']>('title'),
    subtitle: useField<ProfileForm['subtitle']>('subtitle'),
    titleSettings: useField<ProfileForm['titleSettings']>('titleSettings'),
    captionBody: useField<ProfileForm['captionBody']>('captionBody'),
    body: useField<ProfileForm['body']>('body'),
    image: useField<ProfileForm['image']>('image'),
    imageName: useField<ProfileForm['imageName']>('imageName'),
    imageType: useField<ProfileForm['imageType']>('imageType'),
    imageSettings: useField<ProfileForm['imageSettings']>('imageSettings'),
  }

  const resetProfileForm = (profileData?: ProfileType | null) => {
    if (!profileData) return
    formData.title.value.value = profileData.title ?? ''
    formData.subtitle.value.value = profileData.subtitle ?? ''
    formData.titleSettings.value.value = cloneDeep(profileData.titleSettings)
    formData.captionBody.value.value = profileData.captionBody ?? ''
    formData.body.value.value = profileData.body ?? ''
    formData.image.value.value = profileData.image?.url ?? ''
    formData.imageName.value.value = profileData.image?.name ?? ''
    formData.imageType.value.value = profileData.image?.type ?? ''
    formData.imageSettings.value.value = profileData.imageSettings
      ? cloneDeep(profileData.imageSettings)
      : null
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetProfileForm,
  }
}
