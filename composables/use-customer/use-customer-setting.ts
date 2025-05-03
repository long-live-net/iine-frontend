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
  SnsLinkForm,
  SeoTag,
  SeoTagForm,
} from '@/types/customer-setting'

const pageFontFamilies: { [key: string]: string } = {
  notoSansJp: '"Noto Sans JP", "sans-serif"',
  zenKakuGothic: '"Zen Kaku Gothic New", "sans-serif"',
  notoSerifJp: '"Noto Serif JP", "serif"',
  zenOldMincho: '"Zen Old Mincho", "serif"',
  mPlusRounded1c: '"M PLUS Rounded 1c", "sans-serif"',
  zenMaruGothic: '"Zen Maru Gothic", "sans-serif"',
} as const
export const getFontFamilyItems = () => [
  {
    key: '自動',
    value: 'inherit',
    text: 'おはよう世界',
  },
  ...Object.keys(pageFontFamilies).map((key) => ({
    key,
    value: pageFontFamilies[key],
    text: 'おはよう世界',
  })),
]

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
 */
const baseLayoutsOrder: PageLayout[] = [
  { kind: 'contact', title: 'contact' },
  { kind: 'feature', title: 'feature' },
  { kind: 'information', title: 'information' },
  { kind: 'news', title: 'news' },
  { kind: 'menu', title: 'menu' },
  { kind: 'menu-image', title: 'menu by image' },
  { kind: 'service', title: 'service' },
  { kind: 'shop', title: 'shop' },
  { kind: 'profile', title: 'profile' },
  { kind: 'access', title: 'access' },
] as const
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
  const baseSections = ref<PageLayout[]>([])
  const editSections = ref<PageLayout[]>([])

  const reset = () => {
    if (!customerSetting.value) {
      return
    }
    const availContentsKind = customerSetting.value.availContentsKind
    const baseLayout = baseLayoutsOrder
      .filter((b) => availContentsKind.includes(b.kind))
      .map<PageLayout>((b) => {
        const hs = homeLayouts.value?.find((s) => s.kind === b.kind)
        if (hs) {
          b.menuTitle = hs.menuTitle
        }
        return { ...b }
      })

    baseSections.value = baseLayout.filter((b) =>
      homeLayouts.value.every((h) => b.kind !== h.kind)
    )
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

  const initialLoading = ref(false)
  const init = async () => {
    try {
      initialLoading.value = true
      await fetchCustomerSetting()
    } finally {
      initialLoading.value = false
    }
  }

  const editFontFamily = ref<string>('inherit')
  const editTextColor = ref<string | null>(null)
  const editColorTheme = ref<ColorTheme>('light')
  const editDesignTheme = ref<DesignTheme>('type1')

  watch(
    customerSetting,
    () => {
      editFontFamily.value = customerSetting.value?.fontFamily ?? 'inherit'
      editTextColor.value = customerSetting.value?.textColor ?? null
      editColorTheme.value = customerSetting.value?.colorTheme ?? 'light'
      editDesignTheme.value = customerSetting.value?.designTheme ?? 'type1'
    },
    { immediate: true }
  )

  const fontFamilyItems = computed(() => getFontFamilyItems())
  const colorThemeOptions: {
    type: ColorTheme
    label: string
  }[] = [
    { type: 'light', label: 'ライト' },
    { type: 'dark', label: 'ダーク' },
  ]
  const DesignThemeOptions: {
    type: DesignTheme
    label: string
  }[] = [
    { type: 'type1', label: '標準' },
    { type: 'type2', label: 'シャープ' },
  ]

  const _update = async (
    settings: Partial<CustomerSetting>,
    message: string
  ) => {
    if (!customerSetting.value) {
      return
    }
    const data: CustomerSetting = { ...customerSetting.value, ...settings }
    setCustomerSetting(data)
    await updateCustomerSetting(data)
    addSnackber?.(message)
    await fetchCustomerSetting()
  }

  const chengeFontFamily = async (fontFamily: string | null) => {
    if (!fontFamily) {
      return
    }
    await _update({ fontFamily }, 'フォントを更新しました。')
  }

  const chengeTextColor = async (textColor: string | null) => {
    await _update({ textColor }, '文字色を更新しました。')
  }

  const chengeColorTheme = async (colorTheme: ColorTheme | null) => {
    if (!colorTheme) {
      return
    }
    await _update({ colorTheme }, 'カラーテーマを更新しました。')
  }

  const chengeDesignTheme = async (designTheme: DesignTheme | null) => {
    if (!designTheme) {
      return
    }
    await _update({ designTheme }, 'デザインテーマを更新しました。')
  }

  return {
    init,
    initialLoading,
    loading,
    editFontFamily,
    editTextColor,
    editColorTheme,
    editDesignTheme,
    fontFamilyItems,
    colorThemeOptions,
    DesignThemeOptions,
    chengeFontFamily,
    chengeTextColor,
    chengeColorTheme,
    chengeDesignTheme,
  }
}

/**
 * content データの apiKind から pageSectionKind やセクションタイトルといった情報を取得する
 */
const sectionKind2ApiKind = [
  { kind: 'information', apiKind: 'informations' },
  { kind: 'profile', apiKind: 'profiles' },
  { kind: 'news', apiKind: 'newses' },
  { kind: 'service', apiKind: 'services' },
  { kind: 'feature', apiKind: 'features' },
  { kind: 'contact', apiKind: 'contacts' },
  { kind: 'menu', apiKind: 'menus' },
  { kind: 'menu-image', apiKind: 'menu-images' },
  { kind: 'shop', apiKind: 'shops' },
]
export const useGetMenuTitle = (apiKind: string): string | null => {
  const { customerSetting } = useCustomerSetting()
  const sectionKind = sectionKind2ApiKind.find(
    (p) => p.apiKind === apiKind
  )?.kind
  if (!sectionKind) {
    return null
  }
  const sectionInfo = customerSetting.value?.homeLayout.find(
    (l) => l.kind === sectionKind
  )
  if (!sectionInfo) {
    return null
  }
  return sectionInfo.menuTitle ?? sectionInfo.title
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
  const customerFormInitial: SnsLinkForm = {
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
    facebook: useField<SnsLinkForm['facebook']>('facebook'),
    instagram: useField<SnsLinkForm['instagram']>('instagram'),
    twitter: useField<SnsLinkForm['twitter']>('twitter'),
    youtube: useField<SnsLinkForm['youtube']>('youtube'),
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

  const update = async (form: SnsLinkForm) => {
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

/**
 * Customer setting SEO Tags 関連
 */
export const useCustomerSeoTags = () => {
  const { customerSetting } = useCustomerSetting()
  const seoTags = computed<SeoTag[]>(() => customerSetting.value?.seoTags ?? [])
  const getSeoTagName = (seoKeyName: string) => {
    switch (seoKeyName) {
      case 'title':
        return 'title'
      case 'description':
        return 'description'
      case 'ogImage':
        return 'og:image'
      default:
        return ''
    }
  }

  return {
    seoTags,
    getSeoTagName,
  }
}

export const useCustomerSeoTagsForm = () => {
  const { maxLength } = useValidateRules()

  const customerFormSchema = {
    title: (v: string | undefined) =>
      maxLength(v, 40) || '40 文字以内で入力してください',
    description: (v: string | undefined) =>
      maxLength(v, 100) || '100 文字以内で入力してください',
    ogImage: () => true,
  }
  const customerFormInitial: SeoTagForm = {
    title: null,
    description: null,
    ogImage: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: customerFormSchema,
    initialValues: customerFormInitial,
  })

  const formData = {
    title: useField<SeoTagForm['title']>('title'),
    description: useField<SeoTagForm['description']>('description'),
    ogImage: useField<SeoTagForm['ogImage']>('ogImage'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}

export const useCustomerSeoTagsActions = () => {
  const {
    customerSetting,
    fetchCustomerSetting,
    updateCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const update = async (form: SeoTagForm) => {
    if (!customerSetting.value || !customerSetting.value.id) {
      return
    }
    const seoTags: SeoTag[] = []
    if (form.title) {
      seoTags.push({ keyName: 'title', content: form.title })
    }
    if (form.description) {
      seoTags.push({ keyName: 'description', content: form.description })
    }
    if (form.ogImage) {
      seoTags.push({ keyName: 'ogImage', content: form.ogImage })
    }
    const customerSettingData: CustomerSetting = {
      ...customerSetting.value,
      seoTags: seoTags.length ? seoTags : null,
    }
    await updateCustomerSetting(customerSettingData)
    await fetchCustomerSetting()
    addSnackber?.('SEO タグおよび Favicon 情報を更新しました。')
  }
  return {
    customerSetting,
    loading,
    update,
  }
}
