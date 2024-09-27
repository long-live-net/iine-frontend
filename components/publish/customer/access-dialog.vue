<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const accessModal = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
const titleData = {
  title: 'アクセス',
  titleIcon: 'mdi-earth',
  titleColor: 'teal',
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="accessModal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
    width="90dvw"
    theme="auto"
  >
    <PublishCustomerAccessMap />
  </CommonModalDialog>
</template>
