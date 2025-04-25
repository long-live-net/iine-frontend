<template>
  <div class="contents-card-wrap">
    <div class="contents-card g-theme-contents-card2">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contents-card-wrap {
  width: 90%;
  max-width: $contents-card-max-width;
  min-height: $contents-card-min-height;
  margin: 0 auto;

  .contents-card {
    min-height: $contents-card-min-height;
    overflow: hidden;
    border-radius: 12px;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .contents-card-wrap {
    width: 100%;

    .contents-card {
      border-radius: 0;
    }
  }
}
</style>
