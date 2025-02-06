<script setup lang="ts">
const { customerSetting } = useCustomerSetting()
const { customer } = useCustomer()

const pageTitle = computed(
  () => customerSetting.value?.pageTitle?.title ?? customer.value?.name ?? null
)
const description = computed(() =>
  customer.value?.name ? `${customer.value.name} Website` : null
)
const favicon = computed(() =>
  customer.value?.nickName ? `/favicon-${customer.value?.nickName}.ico` : null
)

watch(
  [pageTitle, description, favicon],
  () => {
    if (pageTitle.value && description.value && favicon.value) {
      useHead({
        title: pageTitle.value,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: description.value,
          },
        ],
        link: [
          {
            rel: 'icon',
            type: 'image/x-icon',
            href: favicon.value,
          },
        ],
      })
    } else {
      useHead({
        title: 'IINE',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'IINE Website',
          },
        ],
        link: [
          {
            rel: 'icon',
            type: 'image/x-icon',
            href: './favicon.ico',
          },
        ],
      })
    }
  },
  {
    immediate: true,
  }
)

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
