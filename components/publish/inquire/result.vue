<script setup lang="ts">
defineEmits<{ ok: [] }>()
</script>

<template>
  <div class="inquire-form-result">
    <h4>お問い合せありがとうございます</h4>
    <p>
      お問い合せを受け付けました。<br />
      追ってメールにてご連絡させていただきます。
    </p>
    <div class="inquire-form-result__action">
      <v-btn
        prepend-icon="mdi-close"
        color="secondary"
        width="10rem"
        @click="$emit('ok')"
      >
        閉じる
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inquire-form-result {
  padding: 0 3rem;
  h5 {
    font-size: normal;
    font-weight: bold;
  }
  p {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  &__action {
    text-align: center;
  }
}
@media only screen and (max-width: $grid-breakpoint-md) {
  .inquire-form-result {
    padding: 0;
  }
}
</style>
