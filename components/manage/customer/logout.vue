<script setup lang="ts">
const modal = defineModel<boolean>('modal', { required: true })
const router = useRouter()
const { logout } = useAuth()
const onLogout = () => {
  modal.value = false
  logout()
  router.push('/customer/logout')
}
</script>
<template>
  <BaseConfirm
    v-model:comfirm="modal"
    message="本当にログアウトしますか？"
    exec-text="ログアウト"
    @cancel="modal = false"
    @confirm="onLogout"
  />
</template>
