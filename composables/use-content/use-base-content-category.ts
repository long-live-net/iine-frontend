import type { ContentCategoryForm, ContentCategoryType } from '@/types/content'
import type {
  ListFilter,
  ListPager,
  ListSort,
  ContentCategoryGetApi,
  ContentCategorySaveApi,
  ContentPositionApi,
  ContentListResponse,
} from '@/types/API/content-api'

const useContentCategory = <
  F extends ContentCategorySaveApi,
  T extends ContentCategoryGetApi,
>(
  customerId: Ref<string | null>,
  apiKind: string
) => {
  const { authorizationHeader } = useAuth()
  const { routeKeyId } = useRouteKey()

  const ContentCategoryListRef: Ref<ContentListResponse<T> | null> = ref(null)
  const loading = ref(false)

  const loadList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    ContentCategoryListRef.value = null
    const key = `get_list_content_${apiKind}_${routeKeyId.value}_${JSON.stringify({ filter, sort, pager })}`
    try {
      loading.value = true
      const { data, error } = await useAsyncData(key, () =>
        $fetch<ContentListResponse<T>>(`/${apiKind}`, {
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
      ContentCategoryListRef.value = data.value ?? null
      if (error.value) {
        throw error.value
      }
    } finally {
      loading.value = false
    }
  }

  const getList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    try {
      loading.value = true
      const data = await $fetch<ContentListResponse<T>>(`/${apiKind}`, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: {
          customerId: customerId.value,
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort),
          pager: JSON.stringify(pager),
        },
      })
      ContentCategoryListRef.value = data ?? null
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const create = async (sendData: F): Promise<T> => {
    try {
      loading.value = true
      const data = await $fetch<T>(`/${apiKind}`, {
        baseURL: backendBaseUrl,
        method: 'POST',
        headers: authorizationHeader.value,
        body: sendData,
      })
      return data
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const update = async (contentId: string, sendData: F): Promise<T> => {
    try {
      loading.value = true
      const data = await $fetch<T>(`/${apiKind}/${contentId}`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        body: sendData,
      })
      return data
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const remove = async (contentId: string): Promise<void> => {
    try {
      loading.value = true
      await $fetch(`/${apiKind}/${contentId}`, {
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

  const updatePositions = async (
    positions: ContentPositionApi[]
  ): Promise<void> => {
    try {
      loading.value = true
      await $fetch(`/${apiKind}/positions`, {
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
    if (!ContentCategoryListRef.value) {
      return
    }
    const contentTotal = ContentCategoryListRef.value.total
    const changedList = positions.flatMap((pos) => {
      const fc = ContentCategoryListRef.value?.list.find((c) => pos.id === c.id)
      if (fc) {
        return [{ ...fc, ...pos } as T]
      } else {
        return []
      }
    })
    const unchangedList = ContentCategoryListRef.value?.list.filter((c) =>
      positions.every((p) => p.id !== c.id)
    )
    const categoryList = [...changedList, ...unchangedList]
    ContentCategoryListRef.value = {
      total: contentTotal,
      list: categoryList,
    }
  }

  return {
    loadList,
    getList,
    create,
    update,
    remove,
    updatePositions,
    setListPositions,
    ContentCategoryListRef,
    loading,
  }
}

export const useContentCategoryListActions = <
  T extends ContentCategoryType,
  F extends ContentCategoryForm,
  G extends ContentCategoryGetApi,
  S extends ContentCategorySaveApi,
>(
  apiKind: string,
  contentTitle: string,
  customerId: Ref<string | null>,
  apiToContent: (apiData?: G | null) => T | null,
  formToSaveapi: (formData: F) => S
) => {
  const filter = ref<ListFilter>({})
  const sort = ref<ListSort>({ position: 1 })
  const pager = ref<ListPager>({ page: 1, limit: 20 })

  const { addSnackber } = useSnackbars()
  const {
    loadList,
    getList,
    create,
    update,
    remove,
    updatePositions,
    setListPositions,
    ContentCategoryListRef,
    loading,
  } = useContentCategory<S, G>(customerId, apiKind)

  const listRef = computed<T[]>(
    () =>
      ContentCategoryListRef.value?.list?.flatMap((n) => {
        const category = apiToContent(n)
        return category ? [category] : []
      }) ?? []
  )
  const totalRef = computed<number>(
    () => ContentCategoryListRef.value?.total ?? 0
  )

  const onLoad = async () => {
    await loadList(filter.value, sort.value, pager.value)
  }
  const onGetList = async () => {
    await getList(filter.value, sort.value, pager.value)
  }

  const onCreate = async (formData: F) => {
    const inputData = formToSaveapi(formData)
    const data = await create(inputData)
    addSnackber?.(`${contentTitle} 情報を登録しました。`)
    getList(filter.value, sort.value, pager.value)
    return apiToContent(data ?? null)
  }

  const onUpdate = async ({ id, formData }: { id: string; formData: F }) => {
    if (!id) {
      return null
    }
    const inputData = formToSaveapi(formData)
    const data = await update(id, inputData)
    addSnackber?.(`${contentTitle} 情報を更新しました。`)
    getList(filter.value, sort.value, pager.value)
    return apiToContent(data ?? null)
  }

  const onRemove = async (id: string) => {
    await remove(id)
    addSnackber?.(`${contentTitle} 情報を削除しました。`)
    getList(filter.value, sort.value, pager.value)
  }

  const onUpdatePositions = async (contents: T[]) => {
    const positions = contents.map<ContentPositionApi>((d, i) => ({
      id: d.id,
      position: i + 1,
    }))
    setListPositions(positions)
    await updatePositions(positions)
    addSnackber?.(`${contentTitle} 表示位置を変更しました。`)
    getList(filter.value, sort.value, pager.value)
  }

  return {
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
  }
}
