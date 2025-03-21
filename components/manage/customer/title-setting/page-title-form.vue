<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import type { PageTitle } from '@/types/customer-setting'

const props = withDefaults(
  defineProps<{
    pageTitle: PageTitle
    loading?: boolean
  }>(),
  { loading: false }
)
const emit = defineEmits<{
  cancel: []
  update: [title: PageTitle]
}>()

const { noBlank, maxLength } = useValidateRules()
const titleValidationRule = (v: string | undefined): boolean | string => {
  if (!noBlank(v)) return 'タイトルを入力してください'
  if (!maxLength(v, 20)) return '20文字以内で入力してください'
  return true
}

const formSchema = {
  title: titleValidationRule,
}
const formInitial = {
  title: props.pageTitle.title,
}
const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: formInitial,
})
const formData = {
  title: useField<string>('title'),
}

const onUpdate = handleSubmit((formField) => {
  emit('update', {
    title: formField.title,
    iconUrl: props.pageTitle.iconUrl ?? null,
  })
})
</script>

<template>
  <div class="page-title-setting">
    <h4>ページタイトル</h4>
    <div class="page-title">
      <div>
        <v-text-field
          v-model="formData.title.value.value"
          clearable
          density="comfortable"
          :error-messages="formData.title.errorMessage.value"
          :label="pageTitle.title ?? 'タイトル'"
          placeholder="入力してください"
        />
      </div>
    </div>
  </div>
  <div class="d-flex justify-end mt-1">
    <div>
      <v-btn
        prepend-icon="mdi-content-save"
        color="accent"
        variant="flat"
        width="8rem"
        :loading="loading"
        @click="onUpdate"
      >
        変更する
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-title-setting {
  .page-title {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    margin-top: 1rem;
    padding: 0.25rem 0 0.25rem 1rem;
  }
}
</style>
