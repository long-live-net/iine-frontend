<template>
  <div class="nav-footer g-theme-footer">
    <div class="nav-footer__user">
      <nuxt-link :to="{ name: 'auth-login' }">
        <v-icon icon="mdi-account-circle" color="success" size="x-large" />
      </nuxt-link>
    </div>
    <div class="nav-footer__menu">
      <!-- <component :is="templateName" /> -->
      <p class="copyright">Copyright © 2023 ロングリブネット</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-footer {
  height: $nav-footer-height;
  display: flex;
  align-items: center;
  &__user {
    padding-left: 0.5rem;
  }
  &__menu {
    flex-grow: 10;
    .copyright {
      text-align: center;
    }
  }
}
</style>
