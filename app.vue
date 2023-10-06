<script setup lang="ts">
const { customer } = useFoundation()
const bodyClass = ref('g-theme-default')

watch(
  customer,
  () => {
    if (customer.value?.colorTheme === 'dark') {
      bodyClass.value = 'g-theme-dark'
    } else {
      bodyClass.value = 'g-theme-default'
    }
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <v-app>
    <div :class="bodyClass">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </v-app>
</template>
