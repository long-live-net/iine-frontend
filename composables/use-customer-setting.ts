import type {
  PageSection,
  BasePageSection,
  PageSectionEdit,
} from '@/types/customer-setting'
import type { PageSectionApi } from '@/types/API/customer-setting-api'
import type { ColorTheme, LayoutTheme } from '@/types/customer'

const apiToPageSection = (
  apiData?: PageSectionApi | null
): PageSection | null =>
  apiData
    ? {
        baseId: apiData.baseId,
        id: apiData.id,
        customerId: apiData.customerId,
        kind: apiData.kind as PageSection['kind'],
        title: apiData.title,
        position: apiData.position,
      }
    : null

/**
 * ホームレイアウト情報の取得処理
 * @param customerId
 */
export const useHomeLayoutRead = (customerId: Ref<number | null>) => {
  const apiPath = '/layout/home'
  const domidPrefix = 'home-index'

  const { authorizationHeader } = useAuth()
  const loading = ref(false)
  const homeSections = useState<PageSection[] | null>(() => null)

  const keyExt = ref(1)
  const loadHomeLayout = async () => {
    loading.value = true
    const key = `fetch_home_layout_${apiPath}_${keyExt.value++}`
    try {
      const { data, error } = await useAsyncData(key, () =>
        $fetch<PageSectionApi[]>(apiPath, {
          baseURL: backendBaseUrl,
          method: 'GET',
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
        })
      )
      if (error.value) {
        throw error.value
      }
      homeSections.value = (data.value ?? []).map(
        (d) => apiToPageSection(d) ?? ({} as PageSection)
      )
    } finally {
      loading.value = false
    }
  }

  const fetchHomeLayout = async () => {
    loading.value = true
    const key = `fetch_home_layout_${apiPath}_${keyExt.value}`
    try {
      const data = await $fetch<PageSectionApi[]>(apiPath, {
        baseURL: backendBaseUrl,
        method: 'GET',
        headers: authorizationHeader.value,
        params: { customerId: customerId.value },
      })
      homeSections.value = (data ?? []).map(
        (d) => apiToPageSection(d) ?? ({} as PageSection)
      )
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  return {
    loadHomeLayout,
    fetchHomeLayout,
    homeSections,
    loading,
    domidPrefix,
  }
}

/**
 * ホームレイアウト情報の更新・保存処理
 * @param customerId
 */
export const useHomeLayoutWrite = (customerId: Ref<number | null>) => {
  const apiPath = '/layout/home'
  const { authorizationHeader } = useAuth()
  const loading = ref(false)

  const replaceHomeLayout = async (editSections: PageSectionEdit[]) => {
    let position = 0
    const modifiedData = editSections.map<PageSectionEdit>((s) => {
      const { id, ...modified } = s
      modified.position = ++position
      return modified
    })
    loading.value = true
    try {
      await $fetch<void>(apiPath, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        params: { customerId: customerId.value },
        body: modifiedData,
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  return {
    replaceHomeLayout,
    loading,
  }
}

/**
 * ホームレイアウト情報変更用フォームデータ
 * @param customerId
 */
export const useHomeLayoutEdit = (customerId: Ref<number | null>) => {
  const {
    homeSections,
    fetchHomeLayout,
    loading: readLoading,
  } = useHomeLayoutRead(customerId)

  const { replaceHomeLayout, loading: writeLoading } =
    useHomeLayoutWrite(customerId)

  const { addSnackber } = useSnackbars()

  const baseSections: BasePageSection[] = [
    {
      baseId: 'type1-information',
      kind: 'information',
      title: 'Information',
    },
    {
      baseId: 'type1-news',
      kind: 'news',
      title: 'News',
    },
    {
      baseId: 'type1-service',
      kind: 'service',
      title: 'Service',
    },
    {
      baseId: 'type1-contact',
      kind: 'contact',
      title: 'Contact',
    },
  ]

  const editSections = ref<PageSectionEdit[]>([])
  watch(
    homeSections,
    (sections) => {
      if (!sections?.length) {
        editSections.value = []
        return
      }
      editSections.value = sections.map<PageSectionEdit>((s) => {
        const { id, ...modified } = s
        return modified
      })
    },
    {
      immediate: true,
    }
  )

  const loading = computed(() => readLoading.value || writeLoading.value)

  const onUpdateSections = async () => {
    await replaceHomeLayout(editSections.value)
    await fetchHomeLayout()
    addSnackber?.('ホームページのレイアウトを変更しました。')
  }

  return {
    baseSections,
    editSections,
    loading,
    onUpdateSections,
  }
}

/**
 * 顧客情報のテーマ設定関連
 */
export const useThemeSettingsEdit = () => {
  const { customer, setCustomer, updateCustomer, saving } = useCustomer()
  const { addSnackber } = useSnackbars()

  // Note:
  // computed set のメソッドが promise の場合に throw errro すると
  // unhandled promise rejection エラーとなりNuxt側でハンドリング
  // しないため、computed set の外側で throw する形に実装した
  const error = ref<Error | null>(null)
  watch(error, () => {
    if (error.value) {
      throw error.value
    }
  })
  const editLayoutTheme = computed<LayoutTheme>({
    get: () => customer.value?.layoutTheme ?? 'type1',
    set: async (theme: LayoutTheme) => {
      if (!customer.value) {
        return
      }
      try {
        error.value = null
        const updateData = { ...customer.value, layoutTheme: theme }
        setCustomer(updateData)
        await updateCustomer(updateData)
        addSnackber?.('レイアウトテーマを更新しました。')
      } catch (e) {
        error.value = e as Error
      }
    },
  })
  const editColorTheme = computed<ColorTheme | undefined>({
    get: () => customer.value?.colorTheme,
    set: async (theme?: ColorTheme) => {
      if (!customer.value) {
        return
      }
      try {
        error.value = null
        const updateData = { ...customer.value, colorTheme: theme }
        setCustomer(updateData)
        await updateCustomer(updateData)
        addSnackber?.('カラーテーマを更新しました。')
      } catch (e) {
        error.value = e as Error
      }
    },
  })

  const layoutThemeOptions: {
    type: LayoutTheme
    label: string
  }[] = [
    {
      type: 'type1',
      label: '標準',
    },
    {
      type: 'type2',
      label: 'シャープ',
    },
  ]
  const colorThemeOptions: {
    type: ColorTheme
    label: string
  }[] = [
    {
      type: 'light',
      label: 'ライト',
    },
    {
      type: 'dark',
      label: 'ダーク',
    },
  ]

  return {
    editLayoutTheme,
    editColorTheme,
    layoutThemeOptions,
    colorThemeOptions,
    saving,
  }
}
