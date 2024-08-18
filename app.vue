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
watch(
  bodyClass,
  () => {
    if (import.meta.client) {
      // NOTE: useHead でやると body class のリストに
      // 追加されてしまうため document.body.className
      // を直接書き直す
      document.body.className = bodyClass.value
    } else {
      useHead({ bodyAttrs: { class: bodyClass.value } })
    }
  },
  {
    immediate: true,
  }
)

const baseSnackBars = ref()
useProvideSnackbars(baseSnackBars)
</script>

<template>
  <v-app class="g-theme-app-container">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BaseSnackbars ref="baseSnackBars" />
  </v-app>
</template>
