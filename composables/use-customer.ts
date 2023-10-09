import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import type { Customer } from '@/types/customer'
import type { ColorTheme, LayoutTheme } from '@/types/customer'

/**
 * 顧客情報
 */
export const useCustomer = () => {
  const customerStore = useCustomerStore()
  const { customerRef: customer } = storeToRefs(customerStore)

  const customerId = computed(() => customer.value?.id ?? null)
  const customerName = computed(() => customer.value?.name ?? '')
  const saving = ref(false)

  const setCustomer = (customer: Customer | null) => {
    customerStore.setCustomer(customer)
  }

  const updateCustomer = async (customer: Customer | null) => {
    if (!customer) {
      return
    }
    saving.value = true
    try {
      await customerStore.updateCustomer(customer)
      await customerStore.fetchCustomer(customer.id)
    } finally {
      saving.value = false
    }
  }

  return {
    customer: readonly(customer),
    customerId,
    customerName,
    setCustomer,
    updateCustomer,
    saving,
  }
}

/**
 * 顧客情報のテーマ設定関連
 */
export const useThemeSettingsEdit = () => {
  const { customer, setCustomer, updateCustomer, saving } = useCustomer()

  const editLayoutTheme = computed<LayoutTheme>({
    get: () => customer.value?.layoutTheme ?? 'type1',
    set: (theme: LayoutTheme) => {
      if (customer.value) {
        const updateData = { ...customer.value, layoutTheme: theme }
        setCustomer(updateData)
        updateCustomer(updateData)
      }
    },
  })

  const editColorTheme = computed<ColorTheme | undefined>({
    get: () => customer.value?.colorTheme,
    set: (theme?: ColorTheme) => {
      if (customer.value) {
        const updateData = { ...customer.value, colorTheme: theme }
        setCustomer(updateData)
        updateCustomer(updateData)
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
