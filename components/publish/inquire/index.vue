<script setup lang="ts">
const modal = ref(false)
const titleData = {
  title: 'お問い合わせ',
  titleIcon: 'mdi-email',
  titleColor: 'primary',
}
</script>

<template>
  <BaseActivator
    v-model:modal="modal"
    :activator-icon="titleData.titleIcon"
    :activator-color="titleData.titleColor"
    :activator-text="titleData.title"
  />
  <PublishInquireDialog v-model:modal="modal" />
</template>
