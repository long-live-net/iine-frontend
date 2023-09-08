export const useFoundation = () => {
  const { customerId } = useCustomer()
  const { authToken, userCustomerId } = useAuth()

  const isLoggedIn = computed(
    () =>
      !!authToken.value &&
      !!customerId.value &&
      customerId.value === userCustomerId.value
  )

  const canEdit = ref(false)
  onMounted(() => {
    watch(
      isLoggedIn,
      (value) => {
        canEdit.value = value
      },
      {
        immediate: true,
      }
    )
  })

  return {
    customerId,
    isLoggedIn,
    canEdit,
  }
}
