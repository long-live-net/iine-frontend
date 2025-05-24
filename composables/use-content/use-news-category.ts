import type { NewsCategoryForm, NewsCategoryType } from '@/types/content'
import type {
  NewsCategoryGetApi,
  NewsCategorySaveApi,
} from '@/types/API/content-api'

const apiKind = 'news-categories'
export const getNewsCategoryKind = () => apiKind

const MAXIMUM_LIMIT_OF_CONTENTS = 20 // News Category の登録上限数
export const getNewsCategoryMaximumLimit = () => MAXIMUM_LIMIT_OF_CONTENTS

const useNewsCategoryConverters = (customerId: Ref<string | null>) => {
  const apiToContent = (
    apiData?: NewsCategoryGetApi | null
  ): NewsCategoryType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          category: apiData.category,
          color: apiData.color,
          position: apiData.position,
        }
      : null

  const formToSaveapi = (formData: NewsCategoryForm): NewsCategorySaveApi => ({
    customerId: customerId.value ?? '',
    category: formData.category,
    color: formData.color,
    position: formData.position,
  })

  return {
    apiToContent,
    formToSaveapi,
  }
}

export const useNewsCategoryListActions = (customerId: Ref<string | null>) => {
  const baseTitle = useGetMenuTitle('newses') ?? 'ニュース'
  const contentTitle = `${baseTitle}カテゴリ`
  const { apiToContent, formToSaveapi } = useNewsCategoryConverters(customerId)
  const {
    filter,
    sort,
    pager,
    listRef,
    totalRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  } = useContentCategoryListActions<
    NewsCategoryType,
    NewsCategoryForm,
    NewsCategoryGetApi,
    NewsCategorySaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  const isMaximumLimit = computed(
    () => (listRef.value?.length ?? 0) >= MAXIMUM_LIMIT_OF_CONTENTS
  )

  return {
    contentTitle,
    filter,
    sort,
    pager,
    newsCategoryListRef: listRef,
    newsCategoryTotalRef: totalRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
    isMaximumLimit,
  }
}
