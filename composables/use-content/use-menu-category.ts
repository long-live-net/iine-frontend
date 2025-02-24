import type { MenuCategoryForm, MenuCategoryType } from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  MenuCategoryGetApi,
  MenuCategorySaveApi,
  ContentPositionApi,
  ContentListResponse,
} from '@/types/API/content-api'

const apiPath = 'menu-categories'
export const getMenuCategoryKind = () => apiPath

const useMenuCategoryContent = (customerId: Ref<string | null>) => {
  const { authorizationHeader } = useAuth()

  const menuCategoryListRef: Ref<MenuCategoryType[]> = ref([])
  const menuCategoryTotalRef: Ref<number> = ref(0)
  const loading = ref(false)
  const keyExt = ref(1)

  const apitypeToMenuCategoryType = (
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

  const formToMenuCategorySaveApi = (
    menuId: string,
    formData: MenuCategoryForm
  ): MenuCategorySaveApi => ({
    customerId: customerId.value ?? '',
    menuId: menuId,
    category: formData.category,
    position: formData.position,
  })

  const loadMenuCategoryList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    menuCategoryListRef.value = []
    const key = `get_list_content_${apiPath}_${keyExt.value++}`
    try {
      loading.value = true
      const { data, error } = await useAsyncData(key, () =>
        $fetch<ContentListResponse<MenuCategoryGetApi>>(`/${apiPath}`, {
          baseURL: backendBaseUrl,
          method: 'GET',
          params: {
            customerId: customerId.value,
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
            pager: JSON.stringify(pager),
          },
        })
      )
      menuCategoryListRef.value = (data.value?.list ?? [])
        .map(apitypeToMenuCategoryType)
        .filter((c) => !!c)
      menuCategoryTotalRef.value = data.value?.total ?? 0
      if (error.value) {
        throw error.value
      }
    } finally {
      loading.value = false
    }
  }

  const getMenuCategoryList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    try {
      loading.value = true
      const data = await $fetch<ContentListResponse<MenuCategoryGetApi>>(
        `/${apiPath}`,
        {
          baseURL: backendBaseUrl,
          method: 'GET',
          params: {
            customerId: customerId.value,
            filter: JSON.stringify(filter),
            sort: JSON.stringify(sort),
            pager: JSON.stringify(pager),
          },
        }
      )
      menuCategoryListRef.value = (data.list ?? [])
        .map(apitypeToMenuCategoryType)
        .filter((c) => !!c)
      menuCategoryTotalRef.value = data.total ?? 0
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const createMenuCategory = async (
    menuId: string,
    formData: MenuCategoryForm
  ): Promise<MenuCategoryType | null> => {
    const inputData: MenuCategorySaveApi = formToMenuCategorySaveApi(
      menuId,
      formData
    )
    try {
      loading.value = true
      const data = await $fetch<MenuCategoryGetApi>(`/${apiPath}`, {
        baseURL: backendBaseUrl,
        method: 'POST',
        headers: authorizationHeader.value,
        body: inputData,
      })
      return apitypeToMenuCategoryType(data ?? null)
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const updateMenuCategory = async (
    contentId: string,
    menuId: string,
    formData: MenuCategoryForm
  ): Promise<MenuCategoryType | null> => {
    const inputData: MenuCategorySaveApi = formToMenuCategorySaveApi(
      menuId,
      formData
    )

    try {
      loading.value = true
      const data = await $fetch<MenuCategoryGetApi>(
        `/${apiPath}/${contentId}`,
        {
          baseURL: backendBaseUrl,
          method: 'PUT',
          headers: authorizationHeader.value,
          body: inputData,
        }
      )
      return apitypeToMenuCategoryType(data ?? null)
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const removeMenuCategory = async (contentId: string): Promise<void> => {
    try {
      loading.value = true
      await $fetch(`/${apiPath}/${contentId}`, {
        baseURL: backendBaseUrl,
        headers: authorizationHeader.value,
        method: 'DELETE',
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const updateMenuCategoryPositions = async (
    positions: ContentPositionApi[]
  ): Promise<void> => {
    try {
      loading.value = true
      await $fetch(`/${apiPath}/positions`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        body: positions,
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const setListPositions = (positions: ContentPositionApi[]) => {
    if (!menuCategoryListRef.value.length) {
      return
    }
    const contentList = positions.map((pos) => {
      const fc = menuCategoryListRef.value?.find((c) => pos.id === c.id)
      if (fc) {
        return { ...fc }
      } else {
        return {} as MenuCategoryType
      }
    })
    menuCategoryListRef.value = contentList
  }

  return {
    loadMenuCategoryList,
    getMenuCategoryList,
    createMenuCategory,
    updateMenuCategory,
    removeMenuCategory,
    updateMenuCategoryPositions,
    setListPositions,
    menuCategoryListRef,
    menuCategoryTotalRef,
    loading,
  }
}

/**
 * menuDetail list API アクションサービス
 * @param customerId
 */
export const useMenuCategoryListActions = (customerId: Ref<string | null>) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const contentTitle = 'メニューカテゴリ'
  const { addSnackber } = useSnackbars()
  const {
    loadMenuCategoryList,
    getMenuCategoryList,
    createMenuCategory,
    updateMenuCategory,
    removeMenuCategory,
    updateMenuCategoryPositions,
    setListPositions,
    menuCategoryListRef,
    loading,
  } = useMenuCategoryContent(customerId)

  const onLoad = async () => {
    await loadMenuCategoryList(filter.value, sort.value, pager.value)
  }
  const onGetList = async () => {
    await getMenuCategoryList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (menuId: string, formData: MenuCategoryForm) => {
    await createMenuCategory(menuId, formData)
    addSnackber?.(`${contentTitle} 情報を登録しました。`)
    getMenuCategoryList(filter.value, sort.value, pager.value)
  }

  const onUpdate = async ({
    id,
    menuId,
    formData,
  }: {
    id: string
    menuId: string
    formData: MenuCategoryForm
  }) => {
    if (!id) return

    await updateMenuCategory(id, menuId, formData)
    addSnackber?.(`${contentTitle} 情報を更新しました。`)
    getMenuCategoryList(filter.value, sort.value, pager.value)
  }

  const onRemove = async (id: string) => {
    await removeMenuCategory(id)
    addSnackber?.(`${contentTitle} 情報を削除しました。`)
    getMenuCategoryList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (menuCategoryList: MenuCategoryType[]) => {
    const positions = menuCategoryList.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    await updateMenuCategoryPositions(positions)
    addSnackber?.(`${contentTitle} 表示位置を変更しました。`)
    getMenuCategoryList(filter.value, sort.value, pager.value)
  }

  return {
    filter,
    sort,
    pager,
    menuCategoryListRef,
    onLoad,
    onGetList,
    onCreate,
    onUpdate,
    onRemove,
    onUpdatePositions,
    loading,
  }
}
