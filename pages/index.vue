<script setup lang="ts">
const { changeRouteKeyId } = useRouteKey()
onBeforeRouteLeave(() => {
  changeRouteKeyId()
})
</script>

<template>
  <div id="index-top">
    <PublishHome />
  </div>
</template>

<style lang="scss" scoped>
#index-top {
  padding-top: 0;
  padding-bottom: 3rem;

  @media only screen and (max-width: $grid-breakpoint-md) {
    padding-top: $nav-header-height;
  }
}
</style>
