import type { NetworkServiceink } from '@/types/customer'

export const useCustomerLinks = () => {
  const { customer } = useCustomer()
  const snsLinks = computed<NetworkServiceink[]>(
    () => customer.value?.links ?? []
  )
  const getSnsTitle = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return 'Facebook'
      case 'instagram':
        return 'Instagram'
      case 'twitter':
        return 'X(Twitter)'
      case 'youtube':
        return 'Youtube'
      default:
        return ''
    }
  }
  const getSnsIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return 'mdi-facebook'
      case 'instagram':
        return 'mdi-instagram'
      case 'twitter':
        return 'mdi-twitter'
      case 'youtube':
        return 'mdi-youtube'
      default:
        return ''
    }
  }
  const getSnsColor = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return '#1877F2'
      case 'instagram':
        return '#dd2a7b'
      case 'twitter':
        return 'black'
      case 'youtube':
        return 'red'
      default:
        return ''
    }
  }
  const onClickLink = (serviceName: string) => {
    if (import.meta.client) {
      const url = snsLinks.value.find((l) => l.serviceName === serviceName)?.url
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  const accessSource = computed(() =>
    customer.value
      ? {
          zip: customer.value.zip,
          address: customer.value.address,
          mapSrc: customer.value.accessSource,
        }
      : null
  )

  return {
    snsLinks,
    accessSource,
    getSnsTitle,
    getSnsIcon,
    getSnsColor,
    onClickLink,
  }
}
