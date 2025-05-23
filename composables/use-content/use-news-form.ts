import { cloneDeep } from 'es-toolkit'
import { useForm, useField } from 'vee-validate'
import type { NewsType, NewsForm } from '@/types/content'

export const useNewsForm = () => {
  const { getDefaultTitleSettings } = useContentInit()
  const { required, noBlank, maxLength } = useValidateRules()

  const newsFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    titleSettings: () => true,
    categoryName: (v: string | null) =>
      noBlank(v) || 'カテゴリを入力してください',
    categoryColor: (v: string | null) =>
      noBlank(v) || 'カテゴリを入力してください',
    publishOn: (v: Date | null) => required(v) || '公開日を入力してください',
    body: () => true,
    image: () => true,
    imageName: () => true,
    imageType: () => true,
    imageSettings: () => true,
  }
  const newsFormInitial: NewsForm = {
    title: '',
    titleSettings: getDefaultTitleSettings(),
    categoryName: '',
    categoryColor: '',
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
    categoryName: useField<NewsForm['categoryName']>('categoryName'),
    categoryColor: useField<NewsForm['categoryColor']>('categoryColor'),
    publishOn: useField<NewsForm['publishOn']>('publishOn'),
    body: useField<NewsForm['body']>('body'),
    image: useField<NewsForm['image']>('image'),
    imageName: useField<NewsForm['imageName']>('imageName'),
    imageType: useField<NewsForm['imageType']>('imageType'),
    imageSettings: useField<NewsForm['imageSettings']>('imageSettings'),
  }

  const resetNewsForm = (newsData?: NewsType | null) => {
    if (!newsData) {
      return
    }
    formData.title.value.value = newsData.title
    formData.titleSettings.value.value = cloneDeep(newsData.titleSettings)
    formData.categoryName.value.value = newsData.category.name
    formData.categoryColor.value.value = newsData.category.color
    formData.publishOn.value.value = newsData.publishOn
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
