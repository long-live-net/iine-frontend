<script setup lang="ts">
import type { SectionKind } from '@/types/customer-setting'
import type { BreadCrumbsItem } from '@/components/base/bread-crumb.vue'

const { customerId } = useCustomer()
const { domidPrefix, homeSections } = useHomeLayoutRead(customerId)
const newsItem = computed(() => {
  const kind: SectionKind = 'news'
  const newsSection = homeSections.value?.find((s) => s.kind === kind)
  return {
    title: newsSection?.menuTitle ?? newsSection?.title ?? 'News',
    hash: `#${domidPrefix}-${kind}`,
  }
})
const serviceItem = computed(() => {
  const kind: SectionKind = 'service'
  const servicceSection = homeSections.value?.find((s) => s.kind === kind)
  return {
    title: servicceSection?.menuTitle ?? servicceSection?.title ?? 'Service',
    hash: `#${domidPrefix}-${kind}`,
  }
})

const route = useRoute()
const items = ref<BreadCrumbsItem[]>([])
watch(
  [() => route, newsItem, serviceItem],
  () => {
    switch (route.name) {
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
            title: '詳細',
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
            title: '詳細',
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
