import { useForm, useField } from 'vee-validate'
import type { NewsType, NewsForm } from '@/types/content'

export const useNewsForm = () => {
  const { required, noBlank, maxLength, noBlankForWysiwyg } = useValidateRules()

  const newsFormSchema = {
    title: (v: string | undefined) => {
      if (!noBlank(v)) return 'タイトルを入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    category: (v: string | null) => noBlank(v) || 'カテゴリを入力してください',
    publishOn: (v: Date | null) => required(v) || '公開日を入力してください',
    body: (v: string | undefined) => {
      if (!noBlankForWysiwyg(v)) return '本文を入力してください'
      return true
    },
    image: () => true,
  }
  const newsFormInitial: NewsForm = {
    title: '',
    category: null,
    publishOn: null,
    body: '',
    image: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: newsFormSchema,
    initialValues: newsFormInitial,
  })

  const formData = {
    title: useField<NewsForm['title']>('title'),
    category: useField<NewsForm['category']>('category'),
    publishOn: useField<NewsForm['publishOn']>('publishOn'),
    body: useField<NewsForm['body']>('body'),
    image: useField<NewsForm['image']>('image'),
  }

  const resetNewsForm = (newsData?: NewsType | null) => {
    if (!newsData) return
    formData.title.value.value = newsData?.title ?? ''
    formData.category.value.value = newsData?.category ?? null
    formData.publishOn.value.value = newsData?.publishOn ?? null
    formData.body.value.value = newsData?.body ?? ''
    formData.image.value.value = newsData?.image?.url ?? ''
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetNewsForm,
  }
}
