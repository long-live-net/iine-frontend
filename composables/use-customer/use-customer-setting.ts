import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useCustomerSettingStore } from '@/stores/customer-setting'
import type {
  CustomerSetting,
  PageTitle,
  PageLayout,
  ColorTheme,
  DesignTheme,
  NetworkServiceLink,
  SnsLinksForm,
} from '@/types/customer-setting'

/**
 * 顧客情報
 */
const domidPrefix = 'home-index'
export const useCustomerSetting = () => {
  const customerId = computed(
    () => storeToRefs(useCustomerStore()).customerRef.value?.id ?? null
  )

  const customerSettingStore = useCustomerSettingStore()
  const { customerSettingRef } = storeToRefs(customerSettingStore)
  const loading = ref(false)

  const fetchCustomerSetting = async () => {
    if (!customerId.value) {
      return
    }
    loading.value = true
    await customerSettingStore
      .fetchCustomerSetting(customerId.value)
      .finally(() => {
        loading.value = false
      })
  }

  const updateCustomerSetting = async (
    customerSetting: CustomerSetting | null
  ) => {
    if (!customerSetting) {
      return
    }
    loading.value = true
    await customerSettingStore
      .updateCustomerSetting(customerSetting)
      .finally(() => {
        loading.value = false
      })
  }

  const setCustomerSetting = (customerSetting: CustomerSetting | null) => {
    customerSettingStore.setCustomerSetting(customerSetting)
  }

  return {
    domidPrefix,
    customerSetting: customerSettingRef,
    loading,
    fetchCustomerSetting,
    updateCustomerSetting,
    setCustomerSetting,
  }
}

/**
 * ページタイトル変更処理
 */
export const usePageTitleEdit = () => {
  const {
    customerSetting,
    setCustomerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const pageTitle = computed(() => customerSetting.value?.pageTitle ?? null)
  const initialLoading = ref(false)
  const init = async () => {
    try {
      initialLoading.value = true
      await fetchCustomerSetting()
    } finally {
      initialLoading.value = false
    }
  }
  const updatePageTitle = async (title: PageTitle) => {
    if (!customerSetting.value) {
      return
    }
    const updateData: CustomerSetting = {
      ...customerSetting.value,
      pageTitle: { ...title },
    }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
    addSnackber?.('ページタイトルを変更しました。')
    await fetchCustomerSetting()
  }

  return {
    pageTitle,
    loading,
    initialLoading,
    init,
    updatePageTitle,
  }
}

/**
 * ページセクションタイトル変更処理
 */
export const useHomeLayoutTitleEdit = () => {
  const {
    customerSetting,
    setCustomerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const homeSections = computed(() => customerSetting.value?.homeLayout ?? [])
  const initialLoading = ref(false)
  const init = async () => {
    try {
      initialLoading.value = true
      await fetchCustomerSetting()
    } finally {
      initialLoading.value = false
    }
  }

  const updateMenuTitles = async (sections: PageLayout[]) => {
    if (!customerSetting.value) {
      return
    }
    const updateData: CustomerSetting = {
      ...customerSetting.value,
      homeLayout: [...sections],
    }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
    addSnackber?.('メニュータイトルを変更しました。')
    await fetchCustomerSetting()
  }

  return {
    homeSections,
    initialLoading,
    loading,
    init,
    updateMenuTitles,
  }
}

/**
 * ホームレイアウト変更
 * @param customerId
 */
export const useHomeLayoutEdit = () => {
  const {
    customerSetting,
    setCustomerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const homeLayouts = computed(() => customerSetting.value?.homeLayout ?? [])
  const baseLayoutsOrder: PageLayout[] = [
    { kind: 'information', title: 'information' },
    { kind: 'news', title: 'news' },
    { kind: 'service', title: 'service' },
    { kind: 'contact', title: 'contact' },
    { kind: 'access', title: 'access' },
    { kind: 'menu-image', title: 'menu' },
  ]
  const baseSections = ref<PageLayout[]>([])
  const editSections = ref<PageLayout[]>([])

  const reset = () => {
    if (!customerSetting.value) {
      return
    }
    const availContentsKind = customerSetting.value.availContentsKind
    baseSections.value = baseLayoutsOrder
      .filter((b) => availContentsKind.includes(b.kind))
      .map<PageLayout>((b) => {
        const hs = homeLayouts.value?.find((s) => s.kind === b.kind)
        if (hs) {
          b.menuTitle = hs.menuTitle
        }
        return { ...b }
      })
    editSections.value = homeLayouts.value.map<PageLayout>((s) => ({ ...s }))
  }

  watch(
    customerSetting,
    () => {
      reset()
    },
    {
      immediate: true,
    }
  )

  const initialLoading = ref(false)
  const init = async () => {
    try {
      initialLoading.value = true
      await fetchCustomerSetting()
      reset()
    } finally {
      initialLoading.value = false
    }
  }

  const chengeHomeLayouts = async () => {
    if (!customerSetting.value) {
      return
    }
    const updateData: CustomerSetting = {
      ...customerSetting.value,
      homeLayout: editSections.value,
    }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
    addSnackber?.('ホームページのレイアウトを変更しました')
    await fetchCustomerSetting()
  }

  return {
    baseSections,
    editSections,
    initialLoading,
    loading,
    init,
    chengeHomeLayouts,
  }
}

/**
 * 顧客設定情報のテーマ設定関連
 */
export const useThemeSettingsEdit = () => {
  const {
    customerSetting,
    setCustomerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const editDesignTheme = ref<DesignTheme>('type1')
  const editColorTheme = ref<ColorTheme>('light')

  watch(
    customerSetting,
    () => {
      editDesignTheme.value = customerSetting.value?.designTheme ?? 'type1'
      editColorTheme.value = customerSetting.value?.colorTheme ?? 'light'
    },
    { immediate: true }
  )

  const initialLoading = ref(false)
  const init = async () => {
    try {
      initialLoading.value = true
      await fetchCustomerSetting()
    } finally {
      initialLoading.value = false
    }
  }

  const chengeDesignTheme = async (designTheme: DesignTheme | null) => {
    if (!customerSetting.value || !designTheme) {
      return
    }
    const updateData = { ...customerSetting.value, designTheme }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
    addSnackber?.('デザインテーマを更新しました。')
    await fetchCustomerSetting()
  }

  const chengeColorTheme = async (colorTheme: ColorTheme | null) => {
    if (!customerSetting.value || !colorTheme) {
      return
    }
    const updateData = { ...customerSetting.value, colorTheme }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
    addSnackber?.('カラーテーマを更新しました。')
    await fetchCustomerSetting()
  }

  const DesignThemeOptions: {
    type: DesignTheme
    label: string
  }[] = [
    { type: 'type1', label: '標準' },
    { type: 'type2', label: 'シャープ' },
  ]
  const colorThemeOptions: {
    type: ColorTheme
    label: string
  }[] = [
    { type: 'light', label: 'ライト' },
    { type: 'dark', label: 'ダーク' },
  ]

  return {
    editDesignTheme,
    editColorTheme,
    DesignThemeOptions,
    colorThemeOptions,
    initialLoading,
    loading,
    init,
    chengeDesignTheme,
    chengeColorTheme,
  }
}

/**
 * Customer setting sns links 関連
 */
export const useCustomerSnsLinks = () => {
  const { customerSetting } = useCustomerSetting()
  const snsLinks = computed<NetworkServiceLink[]>(
    () => customerSetting.value?.snsLinks ?? []
  )
  const getSnsTitle = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return 'Facebook'
      case 'instagram':
        return 'Instagram'
      case 'twitter':
        return 'X(Twitter)'
      case 'youtube':
        return 'Youtube'
      default:
        return ''
    }
  }
  const getSnsIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return 'mdi-facebook'
      case 'instagram':
        return 'mdi-instagram'
      case 'twitter':
        return 'mdi-twitter'
      case 'youtube':
        return 'mdi-youtube'
      default:
        return ''
    }
  }
  const getSnsColor = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return '#1877F2'
      case 'instagram':
        return '#dd2a7b'
      case 'twitter':
        return '#1D96EA'
      case 'youtube':
        return 'red'
      default:
        return ''
    }
  }
  const onClickLink = (serviceName: string) => {
    if (import.meta.client) {
      const url = snsLinks.value.find((l) => l.serviceName === serviceName)?.url
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  return {
    snsLinks,
    getSnsTitle,
    getSnsIcon,
    getSnsColor,
    onClickLink,
  }
}

export const useCustomerSnsLinksForm = () => {
  const { validateUrl } = useValidateRules()

  const customerFormSchema = {
    facebook: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    instagram: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    twitter: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    youtube: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
  }
  const customerFormInitial: SnsLinksForm = {
    facebook: null,
    instagram: null,
    twitter: null,
    youtube: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: customerFormSchema,
    initialValues: customerFormInitial,
  })

  const formData = {
    facebook: useField<SnsLinksForm['facebook']>('facebook'),
    instagram: useField<SnsLinksForm['instagram']>('instagram'),
    twitter: useField<SnsLinksForm['twitter']>('twitter'),
    youtube: useField<SnsLinksForm['youtube']>('youtube'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}

export const useCustomerSnsLinksActions = () => {
  const {
    customerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const fetch = async () => {
    if (!customerSetting.value || !customerSetting.value.customerId) {
      return
    }
    await fetchCustomerSetting()
  }

  const update = async (form: SnsLinksForm) => {
    if (!customerSetting.value || !customerSetting.value.id) {
      return
    }
    const links: NetworkServiceLink[] = []
    if (form.facebook) {
      links.push({ serviceName: 'facebook', url: form.facebook })
    }
    if (form.instagram) {
      links.push({ serviceName: 'instagram', url: form.instagram })
    }
    if (form.twitter) {
      links.push({ serviceName: 'twitter', url: form.twitter })
    }
    if (form.youtube) {
      links.push({ serviceName: 'youtube', url: form.youtube })
    }

    const customerSettingData: CustomerSetting = {
      ...customerSetting.value,
      snsLinks: links.length ? links : null,
    }
    await updateCustomerSetting(customerSettingData)
    await fetchCustomerSetting()
    addSnackber?.('SNSページ情報を更新しました。')
  }
  return {
    customerSetting,
    loading,
    fetch,
    update,
  }
}
