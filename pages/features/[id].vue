<template>
  <div id="feature-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishFeaturesDetail />
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
</style>
