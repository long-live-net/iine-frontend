<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const confirmDialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})

const router = useRouter()
const { logout } = useAuth()

const onLogout = () => {
  confirmDialog.value = false
  logout()
  router.push('/customer/logout')
}
</script>
<template>
  <BaseConfirm
    v-model:comfirm="confirmDialog"
    message="本当にログアウトしますか？"
    exec-text="ログアウト"
    @cancel="confirmDialog = false"
    @confirm="onLogout"
  />
</template>
