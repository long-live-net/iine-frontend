<script setup lang="ts">
import type FeaturesList from '@/components/publish/features/list.vue'
const featuresListRef = ref<InstanceType<typeof FeaturesList> | null>(null)
</script>

<template>
  <div id="feature-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishFeaturesDetail @update:data="featuresListRef?.onGetList" />
    <PublishFeaturesList
      ref="featuresListRef"
      no-caption
      class="feature-list-gap"
    />
  </div>
</template>

<style lang="scss" scoped>
#feature-detail-top {
  padding-top: calc($nav-header-height);
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;

  @media only screen and (max-width: $grid-breakpoint-md) {
    margin-bottom: 0;
  }
}

.feature-list-gap {
  margin-top: 6rem;
}
</style>
