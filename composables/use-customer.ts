import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import type {
  Customer,
  CustomerForm,
  NetworkServiceink,
  ColorTheme,
  LayoutTheme,
} from '@/types/customer'

/**
 * 顧客情報
 */
export const useCustomer = () => {
  const customerStore = useCustomerStore()
  const { customerRef: customer } = storeToRefs(customerStore)

  const customerId = computed(() => customer.value?.id ?? null)
  const customerName = computed(() => customer.value?.name ?? '')
  const loading = ref(false)

  const fetchCustomer = async (customerId: number) => {
    loading.value = true
    await customerStore.fetchCustomer(customerId).finally(() => {
      loading.value = false
    })
  }

  const updateCustomer = async (customer: Customer | null) => {
    if (!customer) {
      return
    }
    loading.value = true
    await customerStore.updateCustomer(customer).finally(() => {
      loading.value = false
    })
  }

  const setCustomer = (customer: Customer | null) => {
    customerStore.setCustomer(customer)
  }

  return {
    customer,
    customerId,
    customerName,
    loading,
    fetchCustomer,
    updateCustomer,
    setCustomer,
  }
}

/**
 * Customer Form
 */
export const useCustomerForm = () => {
  const { noBlank, validateEmail, validatePhone, validateUrl } =
    useValidateRules()

  const customerFormSchema = {
    name: (v: string | undefined) => noBlank(v) || '名称を入力してください',
    defaultEmail: (v: string | undefined) => {
      if (!noBlank(v)) return '代表メールアドレスを入力してください'
      if (!validateEmail(v)) return 'メールアドレスの形式で入力してください'
      return true
    },
    phone: (v: string | undefined) =>
      validatePhone(v) || '電話番号の形式で入力してください',
    address: (v: string | undefined) => noBlank(v) || '住所を入力してください',
    note: () => true,
    facebook: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    instagram: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    twitter: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    youtube: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
  }
  const customerFormInitial: CustomerForm = {
    name: '',
    defaultEmail: '',
    phone: null,
    address: '',
    note: null,
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
    name: useField<CustomerForm['name']>('name'),
    defaultEmail: useField<CustomerForm['defaultEmail']>('defaultEmail'),
    phone: useField<CustomerForm['phone']>('phone'),
    address: useField<CustomerForm['address']>('address'),
    note: useField<CustomerForm['note']>('note'),
    facebook: useField<CustomerForm['facebook']>('facebook'),
    instagram: useField<CustomerForm['instagram']>('instagram'),
    twitter: useField<CustomerForm['twitter']>('twitter'),
    youtube: useField<CustomerForm['youtube']>('youtube'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}

/**
 * Customer 変更アクションサービス
 */
export const useCustomerActions = () => {
  const { customer, loading, fetchCustomer, updateCustomer } = useCustomer()
  const { addSnackber } = useSnackbars()

  const update = async (form: CustomerForm) => {
    if (!customer.value || !customer.value.id) {
      return
    }
    const links: NetworkServiceink[] = []
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
    const customerData: Customer = {
      ...customer.value,
      name: form.name,
      defaultEmail: form.defaultEmail,
      phone: form.phone ?? null,
      address: form.address,
      note: form.note ?? null,
      links: links.length ? links : null,
    }
    await updateCustomer(customerData)
    await fetchCustomer(customerData.id)
    addSnackber?.('テナント情報を更新しました。')
  }

  return {
    customer,
    loading,
    update,
  }
}

/**
 * 顧客情報のテーマ設定関連
 */
export const useThemeSettingsEdit = () => {
  const { customer, setCustomer, updateCustomer, fetchCustomer, loading } =
    useCustomer()
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
    set: (theme: LayoutTheme) => {
      if (!customer.value) {
        return
      }
      error.value = null
      const updateData = { ...customer.value, layoutTheme: theme }
      setCustomer(updateData)
      updateCustomer(updateData)
        .then(() => {
          fetchCustomer(updateData.id).catch((e) => {
            error.value = e as Error
          })
          addSnackber?.('レイアウトテーマを更新しました。')
        })
        .catch((e) => {
          error.value = e as Error
        })
    },
  })
  const editColorTheme = computed<ColorTheme>({
    get: () => customer.value?.colorTheme ?? 'light',
    set: (theme: ColorTheme) => {
      if (!customer.value) {
        return
      }
      error.value = null
      const updateData = { ...customer.value, colorTheme: theme }
      setCustomer(updateData)
      updateCustomer(updateData)
        .then(() => {
          fetchCustomer(updateData.id).catch((e) => {
            error.value = e as Error
          })
          addSnackber?.('カラーテーマを更新しました。')
        })
        .catch((e) => {
          error.value = e as Error
        })
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
    loading,
  }
}
