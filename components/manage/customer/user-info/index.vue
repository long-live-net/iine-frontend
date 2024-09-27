<script setup lang="ts">
import type { CustomerUserForm } from '@/types/customer-user'

const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
const titleData = {
  title: 'ユーザ情報',
  titleIcon: 'mdi-account',
  titleColor: 'info',
}
type OperationMode = 'none' | 'display' | 'edit'
const operationMode = ref<OperationMode>('none')

const { user, customer } = useFoundation()
const { customerUserRef, loadingRef, fetch, update, checkEmail } =
  useCustomerUserActions(customer)

watch(dialog, () => {
  if (dialog.value) {
    operationMode.value = 'display'
    if (user.value?.id) {
      fetch(user.value?.id)
    }
  } else {
    // Note:
    // ダイアログが閉じる時にチラチラするため
    // 少しだけ遅れて unmount する
    setTimeout(() => {
      operationMode.value = 'none'
    }, 300)
  }
})

const onUpdate = async (userForm: CustomerUserForm) => {
  if (!user.value?.id) {
    return
  }
  if (!(await checkEmail(user.value.id, userForm))) {
    return
  }
  await update(user.value.id, userForm)
  operationMode.value = 'display'
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="dialog"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <div v-if="operationMode === 'display'" class="user-info">
      <ManageCustomerUserInfoUserDisplay
        :customer-user="customerUserRef"
        @edit="operationMode = 'edit'"
      />
    </div>
    <div v-else-if="operationMode === 'edit'" class="user-info">
      <ManageCustomerUserInfoUserForm
        :customer-user="customerUserRef"
        :loading="loadingRef"
        @update="onUpdate"
        @cancel="operationMode = 'display'"
      />
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.user-info {
  width: 640px;
  max-width: 100%;
}
</style>
