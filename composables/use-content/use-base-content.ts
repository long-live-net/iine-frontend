import { debounce } from 'es-toolkit/compat'
import type { TitleSettings, ImageSettings } from '@/types/content'
import type {
  ContentGetApi,
  ContentSaveApi,
  ListFilter,
  ListSort,
  ListPager,
  ContentListResponse,
  ContentPositionApi,
} from '@/types/API/content-api'

export const useContentUtils = () => {
  const positionStringToValues = (
    positionString?: string | null
  ): { x: number; y: number } => {
    if (!positionString) {
      return { x: 50, y: 50 }
    }
    const ret = positionString.match(
      /^(?<posx>[\d]+\.?[\d]*)%\s+(?<posy>[\d]+\.?[\d]*)%$/
    )
    const x = ret?.groups?.posx ? parseInt(ret.groups.posx) : 50
    const y = ret?.groups?.posy ? parseInt(ret.groups.posy) : 50
    return { x, y }
  }

  const positionValuesToString = (x: number, y: number): string => `${x}% ${y}%`

  const colorStringToUiColor = (colorString?: string | null): string => {
    if (!colorString) {
      return '#FFFFFF84'
    }
    return colorString === 'transparent'
      ? '#FFFFFF84'
      : /^#[\dabcdef]{8}$/i.test(colorString)
        ? colorString.slice(0, 7)
        : colorString
  }

  return {
    positionStringToValues,
    positionValuesToString,
    colorStringToUiColor,
  }
}

export const useContentInit = () => {
  const getDefaultTitleSettings = (): TitleSettings => ({
    fontFamily: 'inherit',
    color: '#FFFFFF',
    bgColor: 'transparent',
    position: '50% 50%',
    align: 'left',
  })

  const getDefaultImageSettings = (): ImageSettings => ({
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll' as 'fixed' | 'scroll',
    smParallax: 'scroll' as 'fixed' | 'scroll',
  })

  return {
    getDefaultTitleSettings,
    getDefaultImageSettings,
  }
}

export const useContentRead = <T extends ContentGetApi>(
  customerId: Ref<string | null>,
  apiPath: string
) => {
  const contentDataRef: Ref<T | null> = ref(null)
  const contentListRef: Ref<ContentListResponse<T> | null> = ref(null)
  const loading = ref(false)

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
  const loadData = async (contentId?: string | null) => {
    contentDataRef.value = null
    const recent = 'recent'
    const key = `get_content_${apiPath}_${contentId ?? recent}`
    const url =
      contentId === undefined || contentId === null
        ? `/${apiPath}/${recent}`
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
    const key = `get_list_content_${apiPath}_${JSON.stringify({ filter, sort, pager })}`
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
  const get = async (contentId?: string | null) => {
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
   * contents list 配列の並び順を引数のIDリストに合わせて更新
   * @param list
   */
  const setListPositions = (positions: ContentPositionApi[]) => {
    if (!contentListRef.value) {
      return
    }
    const contentTotal = contentListRef.value.total
    const changedList = positions
      .map((pos) => {
        const fc = contentListRef.value?.list.find((c) => pos.id === c.id)
        if (fc) {
          return { ...fc, ...pos } as T
        } else {
          return null
        }
      })
      .filter((c) => !!c)
    const unchangedList = contentListRef.value?.list.filter((c) =>
      positions.every((p) => p.id !== c.id)
    )
    const contentList = [...changedList, ...unchangedList]

    contentListRef.value = {
      total: contentTotal,
      list: contentList,
    }
  }

  /**
   * title settings の情報を更新する
   */
  const setTitleSettings = (settings: NonNullable<T['titleSettings']>) => {
    if (!contentDataRef.value) {
      return
    }
    contentDataRef.value.titleSettings = { ...settings }
  }

  /**
   * image settings の情報を更新する
   */
  const setImageSettings = (settings: ImageSettings) => {
    if (!contentDataRef.value) {
      return
    }
    contentDataRef.value.imageSettings = { ...settings }
  }

  return {
    loadData,
    loadList,
    set,
    get,
    getList,
    setListPositions,
    setTitleSettings,
    setImageSettings,
    contentDataRef,
    contentListRef,
    loadingRef: loading,
  }
}

export const useContentWrite = <
  F extends ContentSaveApi,
  T extends ContentGetApi,
>(
  customerId: Ref<string | null>,
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
  const update = async (contentId: string, sendData: F): Promise<T> => {
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
  const remove = async (contentId: string): Promise<void> => {
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
    if (positions.length <= 0) {
      return
    }
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
   * Title Settings 更新
   */
  const updateTitleSettings = async (
    contentId: string,
    titleSettings: NonNullable<T['titleSettings']>
  ): Promise<void> => {
    try {
      loading.value = true
      await $fetch(`/${apiPath}/${contentId}/title-settings`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        body: titleSettings,
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }
  const updateTitleSettingsWithDebounced = debounce(updateTitleSettings, 600)

  /**
   * Image Settings 更新
   */
  const updateImageSettings = async (
    contentId: string,
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

  return {
    create,
    update,
    remove,
    updatePositions,
    updateTitleSettings,
    updateTitleSettingsWithDebounced,
    updateImageSettings,
    updateImageSettingsWithDebounced,
    loadingRef: loading,
  }
}
