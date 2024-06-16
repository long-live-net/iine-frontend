import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { Customer } from '@/types/customer'

const useCustomerApi = (token: Ref<string | null>) => {
  const endpoint = '/customers'
  const keyExt = ref(1)

  const loadByUrl = async (hostname: string) => {
    const key = `fetch_customer_${endpoint}_${keyExt.value++}`
    const { data, error } = await useAsyncData<Customer>(key, () =>
      $fetch(`${endpoint}/customer-url`, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: { url: hostname },
      })
    )
    if (error.value) {
      throw error.value
    }
    return data.value
  }
  const fetch = async (id: number) => {
    const key = `fetch_customer_${endpoint}_${keyExt.value}`
    const data = await $fetch<Customer>(`/customers/${id}`, {
      baseURL: backendBaseUrl,
      method: 'GET',
    })
    return data
  }
  const update = async (customer: Customer) => {
    const data = await $fetch<Customer>(`/customers/${customer.id}`, {
      baseURL: backendBaseUrl,
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value ?? 'notoken'}` },
      body: customer,
    })
    return data
  }

  return {
    loadByUrl,
    fetch,
    update,
  }
}

export const useCustomerStore = defineStore('customer', () => {
  const authStore = useAuthStore()
  const tokenRef = computed(() => authStore.tokenRef)
  const { loadByUrl, fetch, update } = useCustomerApi(tokenRef)

  const customerRef = ref<Customer | null>(null)

  function setCustomer(customer: Customer | null) {
    customerRef.value = customer ? { ...customer } : null
  }

  async function loadCustomerByUrl(url: string) {
    const customer = await loadByUrl(url)
    setCustomer(customer)
  }

  async function fetchCustomer(customerId: number) {
    const customer = await fetch(customerId)
    setCustomer(customer)
  }

  async function updateCustomer(customer: Customer) {
    await update(customer)
  }

  return {
    customerRef,
    setCustomer,
    loadCustomerByUrl,
    fetchCustomer,
    updateCustomer,
  }
})
