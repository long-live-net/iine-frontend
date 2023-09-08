import { useCustomerStore } from '@/stores/customer'

export default defineNuxtPlugin(async () => {
  const customerStore = useCustomerStore()
  const host = useRequestURL().host
  await customerStore.fetchCustomer(host)
})
