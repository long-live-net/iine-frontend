<script setup lang="ts">
import type { SectionKind } from '@/types/customer-setting'
import type { BreadCrumbsItem } from '@/components/base/bread-crumb.vue'

const { domidPrefix, customerSetting } = useCustomerSetting()

const profileItem = computed(() => {
  const kind: SectionKind = 'profile'
  const profileSection = customerSetting.value?.homeLayout?.find(
    (s) => s.kind === kind
  )
  return {
    title: profileSection?.menuTitle ?? profileSection?.title ?? 'Profile',
    hash: `#${domidPrefix}-${kind}`,
  }
})
const newsItem = computed(() => {
  const kind: SectionKind = 'news'
  const newsSection = customerSetting.value?.homeLayout?.find(
    (s) => s.kind === kind
  )
  return {
    title: newsSection?.menuTitle ?? newsSection?.title ?? 'News',
    hash: `#${domidPrefix}-${kind}`,
  }
})
const serviceItem = computed(() => {
  const kind: SectionKind = 'service'
  const servicceSection = customerSetting.value?.homeLayout?.find(
    (s) => s.kind === kind
  )
  return {
    title: servicceSection?.menuTitle ?? servicceSection?.title ?? 'Service',
    hash: `#${domidPrefix}-${kind}`,
  }
})
const featureItem = computed(() => {
  const kind: SectionKind = 'feature'
  const featureSection = customerSetting.value?.homeLayout?.find(
    (s) => s.kind === kind
  )
  return {
    title: featureSection?.menuTitle ?? featureSection?.title ?? 'Feature',
    hash: `#${domidPrefix}-${kind}`,
  }
})
const menuItem = computed(() => {
  const kind: SectionKind = 'menu'
  const menuSection = customerSetting.value?.homeLayout?.find(
    (s) => s.kind === kind
  )
  return {
    title: menuSection?.menuTitle ?? menuSection?.title ?? 'Menu',
    hash: `#${domidPrefix}-${kind}`,
  }
})
const shopItem = computed(() => {
  const kind: SectionKind = 'shop'
  const shopSection = customerSetting.value?.homeLayout?.find(
    (s) => s.kind === kind
  )
  return {
    title: shopSection?.menuTitle ?? shopSection?.title ?? 'Shop',
    hash: `#${domidPrefix}-${kind}`,
  }
})

const detailTitle = computed(() => 'Detail')

const route = useRoute()
const items = ref<BreadCrumbsItem[]>([])
watch(
  [() => route, profileItem, newsItem, serviceItem, featureItem, menuItem],
  () => {
    switch (route.name) {
      case 'profiles-detail':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: profileItem.value.title,
            to: { name: 'index', hash: profileItem.value.hash },
            disabled: false,
          },
          {
            title: detailTitle.value,
            disabled: true,
          },
        ]
        return
      case 'news':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: newsItem.value.title,
            to: { name: 'index', hash: newsItem.value.hash },
            disabled: false,
          },
          {
            title: '一覧',
            disabled: true,
          },
        ]
        return
      case 'news-id':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: newsItem.value.title,
            to: { name: 'index', hash: newsItem.value.hash },
            disabled: false,
          },
          {
            title: '一覧',
            to: { name: 'news' },
            disabled: false,
          },
          {
            title: detailTitle.value,
            disabled: true,
          },
        ]
        return
      case 'services-id':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: serviceItem.value.title,
            to: { name: 'index', hash: serviceItem.value.hash },
            disabled: false,
          },
          {
            title: detailTitle.value,
            disabled: true,
          },
        ]
        return
      case 'features-id':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: featureItem.value.title,
            to: { name: 'index', hash: featureItem.value.hash },
            disabled: false,
          },
          {
            title: detailTitle.value,
            disabled: true,
          },
        ]
        return
      case 'menus-id':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: menuItem.value.title,
            to: { name: 'index', hash: menuItem.value.hash },
            disabled: false,
          },
          {
            title: detailTitle.value,
            disabled: true,
          },
        ]
        return
      case 'shops-id':
        items.value = [
          {
            title: 'HOME',
            to: { name: 'index' },
            disabled: false,
          },
          {
            title: shopItem.value.title,
            to: { name: 'index', hash: shopItem.value.hash },
            disabled: false,
          },
          {
            title: detailTitle.value,
            disabled: true,
          },
        ]
        return
    }
    items.value = []
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <BaseBreadCrumb :items="items" />
  </div>
</template>
