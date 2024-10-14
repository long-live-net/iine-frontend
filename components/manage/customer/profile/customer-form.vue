<script setup lang="ts">
import type { Customer, CustomerForm } from '@/types/customer'

const props = withDefaults(
  defineProps<{
    customer: Customer | null
    loading: boolean
  }>(),
  {
    customer: null,
    loading: false,
  }
)
const emit = defineEmits<{
  cancel: []
  update: [form: CustomerForm]
}>()

const { handleSubmit, formData } = useCustomerForm()
watch(
  () => props.customer,
  () => {
    if (props.customer) {
      formData.name.value.value = props.customer.name
      formData.defaultEmail.value.value = props.customer.defaultEmail
      formData.phone.value.value = props.customer.phone
      formData.address.value.value = props.customer.address
      formData.note.value.value = props.customer.note
    }
  },
  {
    immediate: true,
  }
)

const onUpdate = handleSubmit((userForm) => {
  emit('update', userForm)
})
const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div>
    <v-form class="customer-form">
      <div>
        <v-text-field
          v-model="formData.name.value.value"
          :error-messages="formData.name.errorMessage.value"
          clearable
          label="テナント名称"
          placeholder="テナント名称を入力してください"
        />
      </div>
      <div>
        <v-text-field
          v-model="formData.defaultEmail.value.value"
          :error-messages="formData.defaultEmail.errorMessage.value"
          clearable
          label="代表メールアドレス"
          placeholder="代表メールアドレスを入力してください"
        />
      </div>
      <div>
        <v-text-field
          v-model="formData.phone.value.value"
          :error-messages="formData.phone.errorMessage.value"
          clearable
          label="代表電話番号"
          placeholder="代表電話番号を入力してください"
        />
      </div>
      <div>
        <v-text-field
          v-model="formData.address.value.value"
          :error-messages="formData.address.errorMessage.value"
          clearable
          label="所在地"
          placeholder="代表電話番号を入力してください"
        />
      </div>
      <div>
        <v-text-field
          v-model="formData.note.value.value"
          :error-messages="formData.note.errorMessage.value"
          clearable
          label="備考"
          placeholder="備考を入力してください"
        />
      </div>
    </v-form>
    <div class="actions">
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
.customer-form {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding: 0 1rem;
}

.actions {
  margin-top: 0.5rem;
  padding: 0 1rem;
  text-align: right;
}
</style>
