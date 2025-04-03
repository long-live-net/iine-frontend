<script setup lang="ts">
const comfirm = defineModel<boolean>('comfirm', { required: true })
const props = defineProps<{ contentTitle: string }>()
defineEmits<{ confirm: []; cancel: [] }>()

const titleLabel = computed(() => `${props.contentTitle}を削除`)
</script>

<template>
  <BaseConfirm
    v-model:comfirm="comfirm"
    :title="titleLabel"
    title-icon="mdi-delete"
    title-color="grey-darken-1"
    message="本当に削除しますか？"
    exec-text="削除する"
    width="80%"
    max-width="400px"
    @cancel="$emit('cancel')"
    @confirm="$emit('confirm')"
  />
</template>
