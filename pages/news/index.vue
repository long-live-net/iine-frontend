<template>
  <div id="news-index-top">
    <PublishMenuNavBreadCrumb class="nav-bread-crumbs" />
    <PublishNews />
  </div>
</template>

<style lang="scss" scoped>
#news-index-top {
  padding-top: calc($nav-header-height);
  padding-bottom: 4rem;
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .nav-bread-crumbs {
    margin-bottom: 0;
  }
}
</style>
