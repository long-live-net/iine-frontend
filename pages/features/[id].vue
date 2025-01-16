<script setup lang="ts">
import type FeaturesList from '@/components/publish/features/list/index.vue'
const featuresListRef = ref<InstanceType<typeof FeaturesList> | null>(null)
</script>

<template>
  <div id="feature-detail-top">
    <PublishMenuNavBreadCrumb class="nav-bread-crumbs" />
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
  padding-bottom: 6rem;
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;
}

.feature-list-gap {
  margin-top: 6rem;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  #feature-detail-top {
    padding-bottom: 4.25rem;
  }

  .nav-bread-crumbs {
    margin-bottom: 0;
  }
}
</style>
