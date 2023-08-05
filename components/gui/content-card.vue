<template>
  <div class="contents-card g-theme-contents-card">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$contents-card-lg-max-width: 1140px;

.contents-card {
  width: 100%;
  max-width: $contents-card-lg-max-width;
  margin: 0 auto;
  overflow: hidden;
}

@media only screen and (min-width: $grid-breakpoint-md) {
  .contents-card {
    width: 90%;
    border-radius: 12px;
  }
}
</style>
