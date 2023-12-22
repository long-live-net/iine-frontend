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

export const usePageHeadInfo = () => {
  const { customer } = useCustomer()
  const headInfo = {
    title: customer.value?.name ?? 'IINE',
    description: `${customer.value?.name ?? 'IINE'} Website`,
    favicon: customer.value?.nickName
      ? `favicon-${customer.value?.nickName}.ico`
      : 'favicon.ico',
  }
  return { headInfo }
}
