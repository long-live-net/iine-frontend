import { defineStore } from 'pinia'
import type { Customer } from '@/types/customer'

export const useCustomerStore = defineStore('customer', () => {
  const customerRef = ref<Customer | null>(null)

  function setCustomer(customer: Customer | null) {
    customerRef.value = customer ? { ...customer } : null
  }

  async function fetchCustomer(hostname: string) {
    const { data, error } = await useAsyncData<Customer>(() =>
      $fetch('/customers/customer-url', {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: { url: hostname },
      })
    )
    if (error.value) {
      throw error.value
    }
    setCustomer(data.value)
  }

  return {
    customerRef,
    setCustomer,
    fetchCustomer,
  }
})
