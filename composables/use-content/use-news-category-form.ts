import type { NewsCategoryForm, NewsCategoryType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * newsCategory Form
 */
export const useNewsCategoryForm = () => {
  const { noBlank, maxLength } = useValidateRules()

  const newsCategoryFormSchema = {
    category: (v: string | undefined) => {
      if (!noBlank(v)) return 'カテゴリ名を入力してください'
      if (!maxLength(v, 10)) return '10文字以内で入力してください'
      return true
    },
    color: (v: string | undefined) => {
      if (!noBlank(v)) return '色を選択してください'
      if (v === 'transparent') return '透明色は選択できません'
      if (!maxLength(v, 32)) return '32文字以内で入力してください'
      return true
    },
    position: () => true,
  }
  const newsCategoryFormInitial: NewsCategoryForm = {
    category: '',
    color: '',
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: newsCategoryFormSchema,
    initialValues: newsCategoryFormInitial,
  })

  const formData = {
    category: useField<NewsCategoryForm['category']>('category'),
    color: useField<NewsCategoryForm['color']>('color'),
    position: useField<NewsCategoryForm['position']>('position'),
  }

  const resetNewsCategoryForm = (
    newsCategoryData?: NewsCategoryType | null
  ) => {
    if (!newsCategoryData) {
      return
    }
    formData.category.value.value = newsCategoryData?.category ?? ''
    formData.color.value.value = newsCategoryData?.color ?? ''
    formData.position.value.value = newsCategoryData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetNewsCategoryForm,
  }
}
