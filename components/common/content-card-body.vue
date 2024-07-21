<template>
  <div class="contents-card-body">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.contents-card-body {
  max-width: 54rem;
  margin: 0 auto;
  padding: 2.5rem 3.5rem;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .contents-card-body {
    padding: 2.5rem 1.5rem;
  }
}
</style>
