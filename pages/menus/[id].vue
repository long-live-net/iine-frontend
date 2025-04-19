<script setup lang="ts">
import type MenuList from '@/components/publish/menus/list.vue'
const menuListRef = ref<InstanceType<typeof MenuList> | null>(null)
</script>

<template>
  <div id="menu-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishMenusDetail @update:data="menuListRef?.onGetList" />
    <PublishMenusList ref="menuListRef" no-caption class="menu-list-gap" />
  </div>
</template>

<style lang="scss" scoped>
#menu-detail-top {
  padding-top: calc($nav-header-height);
}

.nav-bread-crumbs {
  margin-bottom: 0;
}

.menu-list-gap {
  margin-top: 6rem;
}
</style>
