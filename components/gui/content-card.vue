<template>
  <div class="contents-card g-theme-contents-card">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$contents-card-max-width: 1140px;
$contents-card-min-height: 240px;

.contents-card {
  width: 100%;
  max-width: $contents-card-max-width;
  min-height: $contents-card-min-height;
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
