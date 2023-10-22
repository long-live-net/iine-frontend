import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { Customer } from '@/types/customer'

const useCustomerApi = (token: Ref<string | null>) => {
  const endpoint = '/customers'
  const keyExt = ref(1)
  const nextKey = () => keyExt.value++

  const fetchByUrl = async (hostname: string) => {
    const key = `fetch_customer_${endpoint}_${keyExt.value}`
    const { data, error } = await useAsyncData<Customer>(key, () =>
      $fetch(`${endpoint}/customer-url`, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: { url: hostname },
      })
    )
    if (error.value) {
      throw createApiError(error.value)
    }
    return data.value
  }
  const fetch = async (id: number) => {
    const key = `fetch_customer_${endpoint}_${keyExt.value}`
    const { data, error } = await useAsyncData<Customer>(key, () =>
      $fetch(`/customers/${id}`, {
        baseURL: backendBaseUrl,
        method: 'GET',
      })
    )
    if (error.value) {
      throw createApiError(error.value)
    }
    return data.value
  }
  const update = async (customer: Customer) => {
    const { data, error } = await useAsyncData<Customer>(() =>
      $fetch(`/customers/${customer.id}`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value ?? 'notoken'}` },
        body: customer,
      })
    )
    if (error.value) {
      throw createApiError(error.value)
    }
    return data
  }

  return {
    nextKey,
    fetchByUrl,
    fetch,
    update,
  }
}

export const useCustomerStore = defineStore('customer', () => {
  const authStore = useAuthStore()
  const tokenRef = computed(() => authStore.tokenRef)
  const { fetchByUrl, fetch, update, nextKey } = useCustomerApi(tokenRef)

  const customerRef = ref<Customer | null>(null)

  function setCustomer(customer: Customer | null) {
    customerRef.value = customer ? { ...customer } : null
  }

  async function fetchCustomerByUrl(url: string) {
    const customer = await fetchByUrl(url)
    setCustomer(customer)
  }

  async function fetchCustomer(customerId: number) {
    const customer = await fetch(customerId)
    setCustomer(customer)
  }

  async function updateCustomer(customer: Customer) {
    await update(customer)
    nextKey()
  }

  return {
    customerRef,
    setCustomer,
    fetchCustomerByUrl,
    fetchCustomer,
    updateCustomer,
  }
})
