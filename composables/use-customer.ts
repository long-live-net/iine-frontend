import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'

export const useCustomer = () => {
  const customerStore = useCustomerStore()
  const { customerRef: customer } = storeToRefs(customerStore)

  const customerId = computed(() => customer.value?.id ?? null)
  const customerName = computed(() => customer.value?.name ?? '')

  return {
    customer: readonly(customer),
    customerId,
    customerName,
  }
}
