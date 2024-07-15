import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import type { Customer } from '@/types/customer'

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
    customer,
    customerId,
    customerName,
    setCustomer,
    updateCustomer,
    saving,
  }
}
