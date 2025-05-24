<script setup lang="ts">
const comfirm = defineModel<boolean>('comfirm', { required: true })
defineProps<{
  title: string
  message: string
}>()
defineEmits<{ confirm: [] }>()
</script>

<template>
  <BaseConfirm
    v-model:comfirm="comfirm"
    :title="title"
    title-icon="mdi-alert"
    title-color="yellow-darken-4"
    :message="message"
    exec-text="了解"
    no-cancel
    width="80%"
    max-width="400px"
    @confirm="$emit('confirm')"
  />
</template>
