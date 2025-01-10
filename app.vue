<script setup lang="ts">
const { customerSetting } = useCustomerSetting()

const bodyClass = computed(() =>
  customerSetting.value?.colorTheme === 'dark'
    ? 'g-theme-dark'
    : 'g-theme-default'
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

const bodyStyleFontFamily = computed(
  () => customerSetting.value?.fontFamily ?? 'inherit'
)
watch(
  bodyStyleFontFamily,
  () => {
    if (import.meta.client) {
      document.body.style.fontFamily = bodyStyleFontFamily.value
    }
  },
  {
    immediate: true,
  }
)

const bodyStyleTextColor = computed(() => customerSetting.value?.textColor)
watch(
  [bodyStyleTextColor, bodyClass],
  () => {
    if (import.meta.client) {
      if (!bodyClass.value) {
        return
      }
      const bodyClassElement = document.querySelector<HTMLElement>(
        `.${bodyClass.value}`
      )
      if (!bodyClassElement) {
        return
      }
      if (bodyStyleTextColor.value) {
        bodyClassElement.style.setProperty(
          '--text-color',
          bodyStyleTextColor.value
        )
      } else if (bodyClassElement.style.getPropertyValue('--text-color')) {
        bodyClassElement.style.removeProperty('--text-color')
      }
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
