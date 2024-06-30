<script setup lang="ts">
const inquireDialog = ref(false)
const onInquire = () => {
  inquireDialog.value = true
}
</script>

<template>
  <div class="nav-footer g-theme-footer">
    <div class="nav-footer__activator">
      <PublishMenuNavFooterMenu @inquire="onInquire" />
    </div>
    <div class="g-block-lg">
      <div class="nav-footer__menu">
        <v-btn prepend-icon="mdi-email" variant="text" @click="onInquire">
          お問い合わせ
        </v-btn>
        <v-btn prepend-icon="mdi-earth" variant="text">アクセス</v-btn>
      </div>
    </div>
  </div>
  <PublishInquireDialog v-model:modal="inquireDialog" />
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
    padding-left: 2rem;
  }
}
</style>
