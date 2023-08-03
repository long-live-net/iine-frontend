/**
 * useValidators
 * validation rules
 */
export type ValidateValueType = string | null | undefined

export const useValidateRules = () => {
  /**
   * 必須項目チェック
   */
  const required = (v: unknown): boolean => !!v

  /**
   * 必須項目かつ no blank チェック
   */
  const noBlank = (v: ValidateValueType): boolean => !!v?.length

  /**
   * 文字数 MIN 以上であることチェック
   */
  const minLength = (v: ValidateValueType, min: number): boolean => {
    if (null === v || undefined === v) {
      return true
    }
    return v.length >= min
  }

  /**
   * 文字数 MAX 以下であることチェック
   */
  const maxLength = (v: ValidateValueType, max: number): boolean => {
    if (null === v || undefined === v) {
      return true
    }
    return v.length <= max
  }

  /**
   * email チェック
   */
  const validateEmail = (v: ValidateValueType) => {
    if (null === v || undefined === v) {
      return true
    }
    if (!v.length) {
      return true
    }
    const format =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return format.test(v)
  }

  /**
   * 電話番号チェック
   */
  const validatePhone = (v: ValidateValueType) => {
    if (null === v || undefined === v) {
      return true
    }
    if (!v.length) {
      return true
    }
    const format = /^\d{2,5}-\d{1,4}-\d{4}$/
    return format.test(v)
  }

  /**
   * Password Complexity
   */
  const passwordComplexity = (v: ValidateValueType) => {
    if (null === v || undefined === v) {
      return true
    }
    if (!v.length) {
      return true
    }
    if (!/[a-z]/.test(v)) return false
    if (!/[A-Z]/.test(v)) return false
    if (!/\d/.test(v)) return false
    return true
  }

  return {
    required,
    noBlank,
    minLength,
    maxLength,
    validateEmail,
    validatePhone,
    passwordComplexity,
  }
}
