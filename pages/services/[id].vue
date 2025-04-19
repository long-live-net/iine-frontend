<script setup lang="ts">
import type ServicesList from '@/components/publish/services/list.vue'
const servicesListRef = ref<InstanceType<typeof ServicesList> | null>(null)
</script>

<template>
  <div id="service-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishServicesDetail @update:data="servicesListRef?.onGetList" />
    <PublishServicesList
      ref="servicesListRef"
      no-caption
      class="service-list-gap"
    />
  </div>
</template>

<style lang="scss" scoped>
#service-detail-top {
  padding-top: calc($nav-header-height);
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;

  @media only screen and (max-width: $grid-breakpoint-md) {
    margin-bottom: 0;
  }
}

.service-list-gap {
  margin-top: 6rem;
}
</style>
