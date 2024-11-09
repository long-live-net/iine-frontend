import { cloneDeep } from 'es-toolkit'
import { useForm, useField } from 'vee-validate'
import type { NewsType, NewsForm } from '@/types/content'

export const useNewsForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { required, noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const newsFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    titleSettings: () => true,
    category: (v: string | null) => noBlank(v) || 'カテゴリを入力してください',
    publishOn: (v: Date | null) => required(v) || '公開日を入力してください',
    body: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '本文を入力してください'
      return true
    },
    image: () => true,
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
  }
  const newsFormInitial: NewsForm = {
    title: '',
    titleSettings: getDefaultTitleSettings(),
    category: null,
    publishOn: null,
    body: '',
    image: '',
    imageName: '',
    imageType: '',
    imageSettings: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: newsFormSchema,
    initialValues: newsFormInitial,
  })

  const formData = {
    title: useField<NewsForm['title']>('title'),
    titleSettings: useField<NewsForm['titleSettings']>('titleSettings'),
    category: useField<NewsForm['category']>('category'),
    publishOn: useField<NewsForm['publishOn']>('publishOn'),
    body: useField<NewsForm['body']>('body'),
    image: useField<NewsForm['image']>('image'),
    imageName: useField<NewsForm['imageName']>('imageName'),
    imageType: useField<NewsForm['imageType']>('imageType'),
    imageSettings: useField<NewsForm['imageSettings']>('imageSettings'),
  }

  const resetNewsForm = (newsData?: NewsType | null) => {
    if (!newsData) return
    formData.title.value.value = newsData.title ?? ''
    formData.titleSettings.value.value = cloneDeep(newsData.titleSettings)
    formData.category.value.value = newsData.category ?? null
    formData.publishOn.value.value = newsData.publishOn ?? null
    formData.body.value.value = newsData.body ?? ''
    formData.image.value.value = newsData.image?.url ?? ''
    formData.imageName.value.value = newsData.image?.name ?? ''
    formData.imageType.value.value = newsData.image?.type ?? ''
    formData.imageSettings.value.value = newsData.imageSettings
      ? cloneDeep(newsData.imageSettings)
      : null
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetNewsForm,
  }
}
