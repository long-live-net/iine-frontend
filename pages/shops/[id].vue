<script setup lang="ts">
// import type ShopsList from '@/components/publish/shops/list.vue'
// const shopsListRef = ref<InstanceType<typeof ShopsList> | null>(null)
</script>

<template>
  <div id="shop-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <!-- <PublishShopsDetail @update:data="shopsListRef?.onGetList" />
    <PublishShopsList
      ref="shopsListRef"
      no-caption
      class="shop-list-gap"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
#shop-detail-top {
  padding-top: calc($nav-header-height);
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;

  @media only screen and (max-width: $grid-breakpoint-md) {
    margin-bottom: 0;
  }
}

.shop-list-gap {
  margin-top: 6rem;
}
</style>
