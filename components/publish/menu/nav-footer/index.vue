<script setup lang="ts">
const { accessSource } = useCustomerLinks()

const inquireDialog = ref(false)
const accessDialog = ref(false)
</script>

<template>
  <div class="nav-footer g-theme-footer">
    <div class="nav-footer__activator">
      <PublishMenuNavFooterMenu />
    </div>
    <div class="g-block-lg">
      <div class="nav-footer__menu">
        <v-btn
          prepend-icon="mdi-email"
          variant="text"
          @click="inquireDialog = true"
        >
          お問い合わせ
        </v-btn>
        <v-btn
          v-if="accessSource"
          prepend-icon="mdi-earth"
          variant="text"
          @click="accessDialog = true"
        >
          アクセス
        </v-btn>
        <PublishCustomerServiceLinks force-icon class="nav-footer__menu__sns" />
      </div>
    </div>
    <div class="g-block-sm">
      <div class="nav-footer__menu">
        <v-btn icon variant="text" @click="inquireDialog = true">
          <v-icon>mdi-email</v-icon>
        </v-btn>
        <v-btn
          v-if="accessSource"
          icon
          variant="text"
          @click="accessDialog = true"
        >
          <v-icon>mdi-earth</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
  <PublishInquireDialog v-model:modal="inquireDialog" />
  <PublishCustomerAccessDialog v-model:modal="accessDialog" />
</template>

<style lang="scss" scoped>
.nav-footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: $nav-footer-height;
  &__activator {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    margin: auto 0;
  }
  &__menu {
    display: flex;
    align-items: center;
    &__sns {
      margin-left: 1rem;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
  }
}
</style>
