import { useForm, useField } from 'vee-validate'
import type { InquireMail } from '@/types/inquire'

/**
 * Inquire Form
 */
export type InquireForm = ReturnType<typeof useInquireForm>['inquireForm']
export const useInquireForm = () => {
  const { noBlank, maxLength, validateEmail, validatePhone } =
    useValidateRules()

  const inquireFormSchema = {
    name: (v: string | undefined) => {
      if (!noBlank(v)) return 'お名前を入力してください'
      if (!maxLength(v, 80)) return '80文字以内で入力してください'
      return true
    },
    email: (v: string | undefined) => {
      if (!noBlank(v)) return 'メールアドレスを入力してください'
      if (!validateEmail(v)) return 'メールアドレスの形式で入力してください'
      return true
    },
    phone: (v: string | undefined) => {
      if (!validatePhone(v)) return '0000-0000-0000 の形式で入力してください'
      return true
    },
    inquiry: (v: string | undefined) =>
      noBlank(v) || 'お問い合わせ内容を入力してください',
  }
  const inquireFormInitial: InquireMail = {
    name: '',
    email: '',
    phone: '',
    inquiry: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: inquireFormSchema,
    initialValues: inquireFormInitial,
  })

  const inquireForm = {
    name: useField<InquireMail['name']>('name'),
    email: useField<InquireMail['email']>('email'),
    phone: useField<InquireMail['phone']>('phone'),
    inquiry: useField<InquireMail['inquiry']>('inquiry'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    inquireForm,
  }
}

/**
 * Send Inquire Email
 * @param customerId
 */
export const useInquireSend = (customerId: Ref<number | null>) => {
  const apiPath = '/inquire'
  const loading = ref(false)

  const sendInquire = async (inquire: InquireMail) => {
    loading.value = true
    try {
      const { data, error } = await useAsyncData(() =>
        $fetch(apiPath, {
          baseURL: backendBaseUrl,
          method: 'POST',
          params: { customerId: customerId.value },
          body: inquire,
        })
      )
      if (error.value) {
        throw createApiError(error.value)
      }
      return data
    } finally {
      loading.value = false
    }
  }
  return {
    sendInquire,
    loading,
  }
}
