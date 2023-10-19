import type {
  PageSection,
  BasePageSection,
  PageSectionEdit,
} from '@/types/customer-setting'
import type { ColorTheme, LayoutTheme } from '@/types/customer'

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
  const nextKey = () => keyExt.value++

  const fetchHomeLayout = async () => {
    loading.value = true
    const key = `fetch_home_layout_${apiPath}_${keyExt.value}`
    try {
      const { data, error } = await useAsyncData<PageSection[]>(key, () =>
        $fetch(apiPath, {
          baseURL: backendBaseUrl,
          method: 'GET',
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
        })
      )
      if (error.value) {
        throw error.value
      }
      homeSections.value = (data.value ?? []).map((d) => ({
        baseId: d.baseId,
        id: d.id,
        customerId: d.customerId,
        kind: d.kind,
        title: d.title,
        position: d.position,
      }))
    } finally {
      loading.value = false
    }
  }

  return {
    nextKey,
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
    const modifiedData = editSections.map((s) => ({
      baseId: s.baseId,
      customerId: s.customerId,
      kind: s.kind,
      title: s.title,
      position: ++position,
      menuTitle: s.menuTitle,
    }))
    loading.value = true
    try {
      const { data, error } = await useAsyncData(() =>
        $fetch(apiPath, {
          baseURL: backendBaseUrl,
          method: 'PUT',
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
          body: modifiedData,
        })
      )
      if (error.value) {
        throw error.value
      }
      return data
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
    nextKey,
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
      editSections.value = sections.map((s) => ({
        baseId: s.baseId,
        customerId: s.customerId,
        kind: s.kind,
        title: s.title,
        position: s.position,
        menuTitle: s.menuTitle,
      }))
    },
    {
      immediate: true,
    }
  )

  const loading = computed(() => readLoading.value || writeLoading.value)

  const onUpdateSections = async () => {
    nextKey()
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

  const editLayoutTheme = computed<LayoutTheme>({
    get: () => customer.value?.layoutTheme ?? 'type1',
    set: async (theme: LayoutTheme) => {
      if (customer.value) {
        const updateData = { ...customer.value, layoutTheme: theme }
        setCustomer(updateData)
        await updateCustomer(updateData)
        addSnackber?.('レイアウトテーマを更新しました。')
      }
    },
  })

  const editColorTheme = computed<ColorTheme | undefined>({
    get: () => customer.value?.colorTheme,
    set: async (theme?: ColorTheme) => {
      if (customer.value) {
        const updateData = { ...customer.value, colorTheme: theme }
        setCustomer(updateData)
        await updateCustomer(updateData)
        addSnackber?.('カラーテーマを更新しました。')
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
