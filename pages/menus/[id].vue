<script setup lang="ts">
import type MenuList from '@/components/publish/menus/detail/list.vue'
const menuListRef = ref<InstanceType<typeof MenuList> | null>(null)

const { changeRouteKeyId } = useRouteKey()
onBeforeRouteLeave(() => {
  changeRouteKeyId()
})
</script>

<template>
  <div id="menu-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishMenusDetail @update:data="menuListRef?.onGetList" />
    <PublishMenusDetailList
      ref="menuListRef"
      no-caption
      class="menu-list-gap"
    />
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
  margin-top: 5rem;
}
</style>
