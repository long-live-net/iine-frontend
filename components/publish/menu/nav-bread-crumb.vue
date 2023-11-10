<script setup lang="ts">
import type { BreadCrumbsItem } from '@/components/base/bread-crumb.vue'
const route = useRoute()
const items = ref<BreadCrumbsItem[]>([])
watch(
  () => route,
  (newRoute) => {
    switch (newRoute?.name) {
      case 'news':
        items.value = [
          { title: 'HOME', to: { name: 'index' }, disabled: false },
          { title: 'NEWS一覧', disabled: true },
        ]
        return
      case 'news-id':
        items.value = [
          { title: 'HOME', to: { name: 'index' }, disabled: false },
          { title: 'NEWS一覧', to: { name: 'news' }, disabled: false },
          { title: 'NEWS詳細', disabled: true },
        ]
        return
    }
    items.value = []
  },
  { immediate: true }
)
</script>

<template>
  <div class="nav-bread-crumbs">
    <BaseBreadCrumb :items="items" />
  </div>
</template>

<style scoped lang="scss">
.nav-bread-crumbs {
  margin-bottom: 2.5rem;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .nav-bread-crumbs {
    margin-bottom: 0;
  }
}
</style>
