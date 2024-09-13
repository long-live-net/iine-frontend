<template>
  <div id="news-detail-top">
    <PublishMenuNavBreadCrumb class="nav-bread-crumbs" />
    <PublishServicesDetail />
    <PublishServicesList no-caption class="service-list-gap" />
  </div>
</template>

<style lang="scss" scoped>
#news-detail-top {
  padding-top: calc($nav-header-height);
  padding-bottom: 6rem;
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;
}

.service-list-gap {
  margin-top: 6rem;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  #news-detail-top {
    padding-bottom: 4.25rem;
  }

  .nav-bread-crumbs {
    margin-bottom: 0;
  }
}
</style>
