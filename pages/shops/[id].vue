<script setup lang="ts">
const { changeRouteKeyId } = useRouteKey()
onBeforeRouteLeave(() => {
  changeRouteKeyId()
})
</script>

<template>
  <div id="shop-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishShopsDetail />
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
</style>
