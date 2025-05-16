import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { CustomerApi } from '@/types/API/customer-api'
import type { Customer } from '@/types/customer'

const useCustomerApi = (token: Ref<string | null>) => {
  const endpoint = '/customers'
  const api2Appdata = (apiData?: CustomerApi | null): Customer | null => {
    if (!apiData) {
      return null
    }
    return {
      id: apiData.id,
      nickName: apiData.nickName,
      name: apiData.name,
      defaultEmail: apiData.defaultEmail,
      phone: apiData.phone ?? '',
      zip: apiData.zip,
      address: apiData.address,
      note: apiData.note ?? null,
    }
  }
  const app2Apidata = (appData: Customer): CustomerApi => ({
    id: appData.id,
    nickName: appData.nickName,
    name: appData.name,
    defaultEmail: appData.defaultEmail,
    ...(appData.phone ? { phone: appData.phone } : {}),
    zip: appData.zip,
    address: appData.address,
    ...(appData.note ? { note: appData.note } : {}),
  })

  const loadByUrl = async (hostname: string): Promise<Customer | null> => {
    const key = `fetch_customer_${endpoint}_${hostname}`
    const { data, error } = await useAsyncData<CustomerApi>(key, () =>
      $fetch(`${endpoint}/customer-url`, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: { customerurl: hostname },
      })
    )
    if (error.value) {
      throw error.value
    }
    return api2Appdata(data.value)
  }
  const fetch = async (id: string): Promise<Customer | null> => {
    const data = await $fetch<CustomerApi | null>(`${endpoint}/${id}`, {
      baseURL: backendBaseUrl,
      method: 'GET',
    })
    return api2Appdata(data)
  }
  const update = async (customer: Customer): Promise<Customer | null> => {
    const data = await $fetch<CustomerApi | null>(
      `${endpoint}/${customer.id}`,
      {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value ?? 'notoken'}` },
        body: app2Apidata(customer),
      }
    )
    return api2Appdata(data)
  }

  return {
    loadByUrl,
    fetch,
    update,
  }
}

export const useCustomerStore = defineStore('customer', () => {
  const { tokenRef } = storeToRefs(useAuthStore())
  const { loadByUrl, fetch, update } = useCustomerApi(tokenRef)

  const customerRef = ref<Customer | null>(null)

  function setCustomer(customer: Customer | null) {
    customerRef.value = customer ? { ...customer } : null
  }

  async function loadCustomerByUrl(url: string) {
    const customer = await loadByUrl(url)
    setCustomer(customer)
  }

  async function fetchCustomer(customerId: string) {
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
