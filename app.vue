<script setup lang="ts">
const { customerSetting } = useCustomerSetting()

watch(
  customerSetting,
  (settings) => {
    if (!settings) {
      return
    }
    const faviconIco = settings.favicon.faviconIco ?? null
    const icoSvg = settings.favicon.icoSvg ?? null
    const appleTouchIconPng = settings.favicon.appleTouchIconPng ?? null
    const linkRel = [
      ...(faviconIco
        ? [{ rel: 'icon', type: 'image/x-icon', href: faviconIco }]
        : []),
      ...(icoSvg ? [{ rel: 'icon', type: 'image/svg+xml', href: icoSvg }] : []),
      ...(appleTouchIconPng
        ? [{ rel: 'apple-touch-icon', href: appleTouchIconPng }]
        : []),
    ]
    if (linkRel.length) {
      useHead({ link: linkRel })
    }

    const title =
      settings.seoTags?.find((t) => t.keyName === 'title')?.content ??
      settings.pageTitle.title
    const description =
      settings.seoTags?.find((t) => t.keyName === 'description')?.content ??
      `${title}のページ`
    const ogImage =
      settings.seoTags?.find((t) => t.keyName === 'ogImage')?.content ?? null

    useSeoMeta({
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogSiteName: title,
      ogType: 'website',
      ogLocale: 'ja_JP',
      // ogUrl: TODO
      ...(ogImage ? { ogImage, twitterCard: 'summary_large_image' } : {}),
    })
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
