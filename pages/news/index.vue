<template>
  <div id="news-index-top">
    <PublishLayoutNavBreadCrumb class="nav-bread-crumbs" />
    <PublishNewsList />
  </div>
</template>

<style lang="scss" scoped>
#news-index-top {
  padding-top: calc($nav-header-height);
}

.nav-bread-crumbs {
  margin-bottom: 2.5rem;

  @media only screen and (max-width: $grid-breakpoint-md) {
    margin-bottom: 0;
  }
}
</style>
