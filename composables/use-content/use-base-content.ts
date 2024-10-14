import { debounce } from 'es-toolkit/compat'
import type { ImageSettings } from '@/types/content'
import type {
  ContentGetApi,
  ContentSaveApi,
  ListFilter,
  ListSort,
  ListPager,
  ContentListResponse,
  ContentPreNextIdApi,
  ContentPositionApi,
} from '@/types/API/content-api'

export const useContentRead = <T extends ContentGetApi>(
  customerId: Ref<number | null>,
  apiPath: string
) => {
  const contentDataRef: Ref<T | null> = ref(null)
  const contentListRef: Ref<ContentListResponse<T> | null> = ref(null)
  const preNextIdRef: Ref<ContentPreNextIdApi | null> = ref(null)
  const loading = ref(false)
  const keyExt = ref(1)

  /**
   * load content data
   *
   * useAsyncData を使用してデータFetchするため、 setup context の中で
   * 初期データをロードするときのみ使用できるメソッド
   *
   * cf. https://nuxt.com/docs/api/composables/use-fetch
   * Nuxt ペイロードへの応答の追加を処理するため、ページのハイドレート時に
   * クライアント側でデータを再フェッチすることなく、
   * サーバーからクライアントに応答を渡すことができます。
   *
   * @param contentId 未設定時は最新データを取得する
   */
  const loadData = async (contentId?: number | null) => {
    contentDataRef.value = null
    const key = `get_content_${apiPath}_${keyExt.value++}`
    const url =
      contentId === undefined || contentId === null
        ? `/${apiPath}/recent`
        : `/${apiPath}/${contentId}`

    try {
      loading.value = true
      const { data, error } = await useAsyncData(key, () =>
        $fetch<T>(url, {
          baseURL: backendBaseUrl,
          method: 'GET',
          params: { customerId: customerId.value },
        })
      )
      if (error.value) {
        throw error.value
      }
      contentDataRef.value = (data.value as T) ?? null
    } finally {
      loading.value = false
    }
  }

  /**
   * load contents list
   *
   * useAsyncData を使用してデータFetchするため、 setup context の中で
   * 初期データをロードするときのみ使用できるメソッド
   *
   * cf. https://nuxt.com/docs/api/composables/use-fetch
   * Nuxt ペイロードへの応答の追加を処理するため、ページのハイドレート時に
   * クライアント側でデータを再フェッチすることなく、
   * サーバーからクライアントに応答を渡すことができます。
   *
   * @param filter 検索フィルタ
   * @param sort ソートキー
   * @param pager ページとページあたり件数
   */
  const loadList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    contentListRef.value = null
    const key = `get_list_content_${apiPath}_${keyExt.value++}`
    try {
      loading.value = true
      const { data, error } = await useAsyncData(key, () =>
        $fetch<ContentListResponse<T>>(`/${apiPath}`, {
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
      contentListRef.value = data.value ?? null
      if (error.value) {
        throw error.value
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * set contentData
   */
  const set = (content: T | null) => {
    contentDataRef.value = content
  }

  /**
   * get content data
   * @param contentId 未設定時は最新データを取得する
   */
  const get = async (contentId?: number | null) => {
    const url =
      contentId === undefined || contentId === null
        ? `/${apiPath}/recent`
        : `/${apiPath}/${contentId}`
    try {
      loading.value = true
      const data = await $fetch<T>(url, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: { customerId: customerId.value },
      })
      contentDataRef.value = data ?? null
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  /**
   * get contents list
   * @param filter 検索フィルタ
   * @param sort ソートキー
   * @param pager ページとページあたり件数
   */
  const getList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    try {
      loading.value = true
      const data = await $fetch<ContentListResponse<T>>(`/${apiPath}`, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: {
          customerId: customerId.value,
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort),
          pager: JSON.stringify(pager),
        },
      })
      contentListRef.value = data ?? null
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  /**
   * get Pre and Next ContentId
   * @param currentId 現在の ContentId
   * @param filter 検索フィルタ
   * @param sort ソートキー
   */
  const getPreNextId = async (
    currentId: number,
    filter: ListFilter = {},
    sort: ListSort = {}
  ) => {
    const url = `/${apiPath}/${currentId}/pre-next-id`
    try {
      loading.value = true
      const data = await $fetch<ContentPreNextIdApi>(url, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: {
          customerId: customerId.value,
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort),
        },
      })
      preNextIdRef.value = data ?? null
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  /**
   * contents list 配列の並び順を引数のIDリストに合わせて更新
   * @param list
   */
  const setListPositions = (positions: ContentPositionApi[]) => {
    if (!contentListRef.value) return

    const contentTotal = contentListRef.value.total
    const contentList = positions.map((pos) => {
      const fc = contentListRef.value?.list.find((c) => pos.id === c.id)
      if (fc) {
        return { ...fc }
      } else {
        return {} as T
      }
    })
    contentListRef.value = {
      total: contentTotal,
      list: contentList,
    }
  }

  /**
   * image settings の情報を更新する
   */
  const setImageSettings = (settings: ImageSettings) => {
    if (!contentDataRef.value) return
    if (!contentDataRef.value.image?.settings) return

    contentDataRef.value.image.settings = { ...settings }
  }

  return {
    loadData,
    loadList,
    set,
    get,
    getList,
    getPreNextId,
    setListPositions,
    setImageSettings,
    contentDataRef: readonly(contentDataRef),
    contentListRef: readonly(contentListRef),
    preNextIdRef: readonly(preNextIdRef),
    loadingRef: readonly(loading),
  }
}

export const useContentWrite = <
  F extends ContentSaveApi,
  T extends ContentGetApi,
>(
  customerId: Ref<number | null>,
  apiPath: string
) => {
  const loading = ref(false)
  const { authorizationHeader } = useAuth()

  /**
   * create content data
   * @param newData
   */
  const create = async (sendData: F): Promise<T> => {
    try {
      loading.value = true
      const data = await $fetch<T>(`/${apiPath}`, {
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

  /**:w
   *
   * update content data
   * @param contentId
   * @param modData
   */
  const update = async (contentId: number, sendData: F): Promise<T> => {
    try {
      loading.value = true
      const data = await $fetch<T>(`/${apiPath}/${contentId}`, {
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

  /**
   * remove content data
   * @param contentId
   */
  const remove = async (contentId: number): Promise<void> => {
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

  /**
   * 並び順更新
   * @param updatedList
   */
  const updatePositions = async (
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

  /**
   * Image Settings 更新
   */
  const updateImageSettings = async (
    contentId: number,
    imageSettings: ImageSettings
  ): Promise<void> => {
    try {
      loading.value = true
      await $fetch(`/${apiPath}/${contentId}/image-settings`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        body: imageSettings,
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }
  const updateImageSettingsWithDebounced = debounce(updateImageSettings, 600)

  const getDefaultImageSettings = (): ImageSettings => ({
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll' as 'fixed' | 'scroll',
    smParallax: 'scroll' as 'fixed' | 'scroll',
  })

  return {
    create,
    update,
    remove,
    updatePositions,
    updateImageSettings,
    updateImageSettingsWithDebounced,
    getDefaultImageSettings,
    loadingRef: readonly(loading),
  }
}
