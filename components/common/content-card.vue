<template>
  <div class="contents-card-wrap">
    <div class="contents-card g-theme-contents-card">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$contents-card-max-width: 1140px;
$contents-card-min-height: 240px;

.contents-card-wrap {
  width: 100%;
  max-width: $contents-card-max-width;
  min-height: $contents-card-min-height;
  margin: 0 auto;
  .contents-card {
    min-height: $contents-card-min-height;
    overflow: hidden;
  }
}

@media only screen and (min-width: $grid-breakpoint-md) {
  .contents-card-wrap {
    width: 90%;
    .contents-card {
      border-radius: 12px;
    }
  }
}
</style>
