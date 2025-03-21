<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    textNoWrap?: boolean
    keepCenter?: boolean
  }>(),
  {
    subtitle: '',
    textNoWrap: false,
    keepCenter: false,
  }
)
</script>

<template>
  <div class="content-card-title">
    <h5
      class="g-text-cl"
      :class="{ 'text-no-wrap': textNoWrap, 'keep-center': keepCenter }"
    >
      {{ title }}
    </h5>
    <p
      v-if="subtitle"
      class="g-text-cl"
      :class="{ 'text-no-wrap': textNoWrap, 'keep-center': keepCenter }"
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

  .keep-center {
    text-align: center !important;
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
