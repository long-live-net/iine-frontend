<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import type { FieldContext } from 'vee-validate'
import type { PageLayout } from '@/types/customer-setting'

const props = withDefaults(
  defineProps<{
    homeSections: PageLayout[] | null
    loading: boolean
  }>(),
  {
    loading: false,
  }
)
const emit = defineEmits<{
  cancel: []
  update: [sections: PageLayout[]]
}>()

const { noBlank, maxLength } = useValidateRules()
const titleValidationRule = (v: string | undefined): boolean | string => {
  if (!noBlank(v)) return 'タイトルを入力してください'
  if (!maxLength(v, 20)) return '20文字以内で入力してください'
  return true
}
const formContext = useForm()
const formFieldsOrder = props.homeSections?.map((s) => ({
  kind: `${s.kind}`,
  label: s.menuTitle ?? s.title,
}))
const formFields = props.homeSections?.reduce<{
  [id: string]: FieldContext<string> | FieldContext<string | undefined>
}>(
  (pre, s) => ({
    ...pre,
    [`${s.kind}`]: useField(`${s.kind}`, titleValidationRule, {
      initialValue: s.menuTitle ?? s.title,
    }),
  }),
  {}
)

const onCancel = () => {
  emit('cancel')
}

const onUpdate = formContext.handleSubmit((formField) => {
  emit(
    'update',
    props.homeSections?.map((s) => ({
      ...s,
      menuTitle: formField[s.kind],
    })) ?? []
  )
})
</script>

<template>
  <div class="section-title-setting">
    <section>
      <h4>メニュータイトル</h4>
      <div class="section-titles">
        <p class="font-weight-bold mb-2">
          <small class="text-blue-darken-1">
            メニュータイトルを変更できます
          </small>
        </p>
        <template v-if="formContext && formFields">
          <div v-for="field in formFieldsOrder" :key="field.kind">
            <v-text-field
              v-model="formFields[field.kind].value.value"
              clearable
              density="comfortable"
              :error-messages="formFields[field.kind].errorMessage.value"
              :label="field.label"
              placeholder="入力してください"
            />
          </div>
        </template>
      </div>
    </section>
  </div>
  <div class="d-flex justify-end mt-4">
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
      <v-btn
        prepend-icon="mdi-cancel"
        color="secondary"
        variant="flat"
        width="8rem"
        class="ml-1"
        @click="onCancel"
      >
        キャンセル
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-title-setting {
  .section-titles {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    margin-top: 1rem;
    padding: 0.25rem 1rem;
  }
}
</style>
