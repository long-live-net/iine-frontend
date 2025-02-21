import type { MenuCategoryForm, MenuCategoryType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * menuCategory Form
 */
export const useMenuCategoryForm = () => {
  const { noBlank, maxLength } = useValidateRules()

  const menuCategoryFormSchema = {
    category: (v: string | undefined) => {
      if (!noBlank(v)) return 'メニューカテゴリ名を入力してください'
      if (!maxLength(v, 40)) return '40文字以内で入力してください'
      return true
    },
    position: () => true,
  }
  const menuCategoryFormInitial: MenuCategoryForm = {
    category: '',
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: menuCategoryFormSchema,
    initialValues: menuCategoryFormInitial,
  })

  const formData = {
    category: useField<MenuCategoryForm['category']>('category'),
    position: useField<MenuCategoryForm['position']>('position'),
  }

  const resetMenuCategoryForm = (
    menuCategoryData?: MenuCategoryType | null
  ) => {
    if (!menuCategoryData) {
      return
    }
    formData.category.value.value = menuCategoryData?.category ?? ''
    formData.position.value.value = menuCategoryData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetMenuCategoryForm,
  }
}
