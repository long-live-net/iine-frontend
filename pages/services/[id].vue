<template>
  <div id="service-detail-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishServicesDetail />
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
</style>
