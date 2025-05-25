import type { MenuCategoryForm, MenuCategoryType } from '@/types/content'
import type {
  MenuCategoryGetApi,
  MenuCategorySaveApi,
} from '@/types/API/content-api'

const apiKind = 'menu-categories'
export const getMenuCategoryKind = () => apiKind

const MAXIMUM_LIMIT_OF_CONTENTS = 300 // MenuCategory の登録上限数
export const getMenuCategoryMaximumLimit = () => MAXIMUM_LIMIT_OF_CONTENTS

const useMenuCategoryConverters = (customerId: Ref<string | null>) => {
  const currentMenuId = ref<string>('')
  const setCurrentMenuId = (menuId: string) => {
    currentMenuId.value = menuId
  }

  const apiToContent = (
    apiData?: MenuCategoryGetApi | null
  ): MenuCategoryType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          menuId: apiData.menuId,
          category: apiData.category,
          position: apiData.position,
        }
      : null

  const formToSaveapi = (formData: MenuCategoryForm): MenuCategorySaveApi => ({
    customerId: customerId.value ?? '',
    menuId: currentMenuId.value,
    category: formData.category,
    position: formData.position,
  })

  return {
    setCurrentMenuId,
    apiToContent,
    formToSaveapi,
  }
}
export const useMenuCategoryListActions = (customerId: Ref<string | null>) => {
  const baseTitle = useGetMenuTitle('menus') ?? 'メニュー'
  const contentTitle = `${baseTitle}カテゴリ`
  const { setCurrentMenuId, apiToContent, formToSaveapi } =
    useMenuCategoryConverters(customerId)
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
    MenuCategoryType,
    MenuCategoryForm,
    MenuCategoryGetApi,
    MenuCategorySaveApi
  >(apiKind, contentTitle, customerId, apiToContent, formToSaveapi)

  const onCreateCategory = async (
    menuId: string,
    formData: MenuCategoryForm
  ): Promise<MenuCategoryType | null> => {
    setCurrentMenuId(menuId)
    return await onCreate(formData)
  }

  const onUpdateCategory = async ({
    menuId,
    id,
    formData,
  }: {
    menuId: string
    id: string
    formData: MenuCategoryForm
  }): Promise<MenuCategoryType | null> => {
    setCurrentMenuId(menuId)
    return await onUpdate({ id, formData })
  }

  const isMaximumLimit = computed(
    () => (totalRef.value ?? 0) >= MAXIMUM_LIMIT_OF_CONTENTS
  )

  return {
    contentTitle,
    filter,
    sort,
    pager,
    menuCategoryListRef: listRef,
    menuCategoryTotalRef: totalRef,
    onLoad,
    onGetList,
    onCreateCategory,
    onUpdateCategory,
    onRemove,
    onUpdatePositions,
    loading,
    isMaximumLimit,
  }
}
