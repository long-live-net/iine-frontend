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
   * WYSIWYG Editor 用 noBlank チェック
   */
  const noBlankForWysiwyg = (v: ValidateValueType) => {
    // データが設定されていない場合は false
    if (!v?.length) return false

    // 事前チェック 経験則から128文字以上であれば
    // さすがに blank にはならないはずなので OK とする
    if (v.length > 128) return true

    // HTMLタグを排除した結果の文字列で no blank を判定する
    const plainString = v.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    return plainString.length > 0
  }

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
    noBlankForWysiwyg,
    minLength,
    maxLength,
    validateEmail,
    validatePhone,
    passwordComplexity,
  }
}
