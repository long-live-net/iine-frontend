import type { ShopCategoryForm, ShopCategoryType } from '@/types/content'
import { useField, useForm } from 'vee-validate'

/**
 * shopCategory Form
 */
export const useShopCategoryForm = () => {
  const { noBlank, maxLength } = useValidateRules()

  const shopCategoryFormSchema = {
    category: (v: string | undefined) => {
      if (!noBlank(v)) return 'カテゴリ名を入力してください'
      if (!maxLength(v, 15)) return '15文字以内で入力してください'
      return true
    },
    position: () => true,
  }
  const shopCategoryFormInitial: ShopCategoryForm = {
    category: '',
    position: 0,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: shopCategoryFormSchema,
    initialValues: shopCategoryFormInitial,
  })

  const formData = {
    category: useField<ShopCategoryForm['category']>('category'),
    position: useField<ShopCategoryForm['position']>('position'),
  }

  const resetShopCategoryForm = (
    shopCategoryData?: ShopCategoryType | null
  ) => {
    if (!shopCategoryData) {
      return
    }
    formData.category.value.value = shopCategoryData?.category ?? ''
    formData.position.value.value = shopCategoryData?.position ?? 0
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
    resetShopCategoryForm,
  }
}
