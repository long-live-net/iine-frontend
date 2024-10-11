import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import type { Customer, CustomerForm } from '@/types/customer'

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
  const { noBlank, validateEmail, validatePhone } = useValidateRules()

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
  }
  const customerFormInitial: CustomerForm = {
    name: '',
    defaultEmail: '',
    phone: null,
    address: '',
    note: null,
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
    const customerData: Customer = {
      ...customer.value,
      name: form.name,
      defaultEmail: form.defaultEmail,
      phone: form.phone ?? null,
      address: form.address,
      note: form.note ?? null,
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
