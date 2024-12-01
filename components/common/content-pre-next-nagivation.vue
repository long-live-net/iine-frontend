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
    <div v-if="preUrl">
      <nuxt-link :to="preUrl">
        <v-icon icon="mdi-arrow-left-drop-circle" :size="38" />
      </nuxt-link>
    </div>
    <div v-else />
    <div v-if="nextUrl">
      <nuxt-link :to="nextUrl">
        <v-icon icon="mdi-arrow-right-drop-circle" :size="38" />
      </nuxt-link>
    </div>
    <div v-else />
  </div>
</template>

<style lang="scss" scoped>
.nav-pre-next-link {
  display: flex;
  justify-content: space-between;
  margin: 1rem 1.5rem;
}
</style>
