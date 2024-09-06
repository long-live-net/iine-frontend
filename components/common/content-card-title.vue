<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    textNoWrap?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    textNoWrap: false,
  }
)
</script>

<template>
  <div class="content-card-title">
    <h5 class="g-text-cl" :class="{ 'text-no-wrap': textNoWrap }">
      {{ title }}
    </h5>
    <p
      v-if="subtitle"
      class="g-text-cl"
      :class="{ 'text-no-wrap': textNoWrap }"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.content-card-title {
  padding: 1rem 2rem;
  font-weight: bold;
  h5 {
    font-size: 1.4rem;
  }
  p {
    font-size: 1.1rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .content-card-title {
    h5 {
      font-size: 1.25rem;
    }
    p {
      font-size: 1rem;
    }
  }
}
</style>
