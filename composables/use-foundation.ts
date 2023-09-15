export const useFoundation = () => {
  const { customer, customerId } = useCustomer()
  const { authToken, authUser, userCustomerId } = useAuth()

  const isLoggedIn = computed(
    () =>
      !!authToken.value &&
      !!customerId.value &&
      customerId.value === userCustomerId.value
  )

  const isPreview = useState<boolean>('isPreview', () => false)
  const togglePreview = () => {
    isPreview.value = !isPreview.value
  }

  const canEdit = ref(false)
  onMounted(() => {
    watch(
      [isLoggedIn, isPreview],
      () => {
        canEdit.value = isLoggedIn.value && !isPreview.value
      },
      {
        immediate: true,
      }
    )
  })

  return {
    customerId,
    isLoggedIn,
    isPreview: readonly(isPreview),
    togglePreview,
    canEdit,
    user: authUser,
    customer,
  }
}
