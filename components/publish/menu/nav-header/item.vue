<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    linkTo: string | { name: string; hash?: string }
    title?: string
    color?: string
    hoverColor?: string
  }>(),
  {
    title: '',
    color: 'white',
    hoverColor: 'skyblue',
  }
)
</script>

<template>
  <p class="header-item">
    <nuxt-link :to="linkTo">
      <slot>
        {{ title }}
      </slot>
    </nuxt-link>
  </p>
</template>

<style scoped lang="scss">
.header-item {
  font-weight: bold;
  :deep(a) {
    display: inline-block;
    font-weight: bold;
    color: v-bind(color) !important;
  }
  :deep(a:hover) {
    color: v-bind(hoverColor) !important;
  }
}
</style>
