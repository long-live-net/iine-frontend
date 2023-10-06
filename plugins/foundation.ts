import { useCustomerStore } from '@/stores/customer'

export default defineNuxtPlugin(async () => {
  const customerStore = useCustomerStore()
  const url = useRequestURL().host
  await customerStore.fetchCustomerByUrl(url)
})
