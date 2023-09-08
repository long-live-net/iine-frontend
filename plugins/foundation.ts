import { useCustomerStore } from '@/stores/customer'

export default defineNuxtPlugin(async (nuxtApp) => {
  const customerStore = useCustomerStore()
  const host = useRequestURL().host
  await customerStore.fetchCustomer(host)
})
