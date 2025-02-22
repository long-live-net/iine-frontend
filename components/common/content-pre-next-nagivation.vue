<script setup lang="ts">
withDefaults(
  defineProps<{
    preUrl?: string | null
    nextUrl?: string | null
  }>(),
  {
    preUrl: null,
    nextUrl: null,
  }
)
</script>

<template>
  <div class="nav-pre-next-link">
    <div v-if="preUrl" class="pre">
      <nuxt-link :to="preUrl">
        <v-icon icon="mdi-arrow-left-drop-circle" :size="38" />
      </nuxt-link>
    </div>
    <div v-else />
    <div v-if="nextUrl" class="next">
      <nuxt-link :to="nextUrl">
        <v-icon icon="mdi-arrow-right-drop-circle" :size="38" />
      </nuxt-link>
    </div>
    <div v-else />
  </div>
</template>

<style lang="scss" scoped>
.nav-pre-next-link {
  position: relative;
  height: 1rem;

  .pre {
    position: absolute;
    top: 0.5rem;
    left: 1.5rem;
    z-index: 5;

    @media only screen and (max-width: $grid-breakpoint-md) {
      left: 0;
    }
  }

  .next {
    position: absolute;
    top: 0.5rem;
    right: 1.5rem;
    z-index: 5;

    @media only screen and (max-width: $grid-breakpoint-md) {
      right: 0;
    }
  }
}
</style>
