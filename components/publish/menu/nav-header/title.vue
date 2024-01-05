<script setup lang="ts">
type HeaderTitle = {
  linkTo?: string | { name: string; hash?: string }
  title?: string
  color?: string
  hoverColor?: string
}
withDefaults(defineProps<HeaderTitle>(), {
  linkTo: '',
  title: '',
  color: 'white',
  hoverColor: 'skyblue',
})

defineEmits<{ click: [] }>()
</script>

<template>
  <h3 class="header-title">
    <nuxt-link v-if="linkTo" :to="linkTo">
      <slot>
        {{ title }}
      </slot>
    </nuxt-link>
    <span v-else @click.stop="$emit('click')">
      <slot>
        {{ title }}
      </slot>
    </span>
  </h3>
</template>

<style scoped lang="scss">
.header-title {
  font-weight: 900;
  :deep(a) {
    display: inline-block;
    font-weight: 900;
    color: v-bind(color) !important;
  }
  :deep(a:hover) {
    color: v-bind(hoverColor) !important;
  }
  span {
    color: v-bind(color) !important;
    cursor: pointer;
    &:hover {
      color: v-bind(hoverColor) !important;
    }
  }
}
</style>
