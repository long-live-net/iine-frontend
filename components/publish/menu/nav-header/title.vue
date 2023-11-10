<script setup lang="ts">
export type HeaderTitle = {
  title: string
  color?: string
  hoverColor?: string
  logo?: { url: string; alt: string }
  to?: { name: string; hash?: string }
}
const props = defineProps<{
  headerTitle: HeaderTitle
}>()

const titleColor = computed(() => props.headerTitle.color ?? 'white')
const titleHoverColor = computed(
  () => props.headerTitle.hoverColor ?? 'skyblue'
)
const titleTo = computed(
  () => props.headerTitle.to ?? { name: 'index', hash: '#home-index-top' }
)
</script>

<template>
  <h2 class="header-title">
    <img
      v-if="headerTitle.logo"
      :src="headerTitle.logo.url"
      :alt="headerTitle.logo.alt"
      width="auto"
      height="1.1em"
    />
    <nuxt-link :to="titleTo">
      {{ headerTitle.title }}
    </nuxt-link>
  </h2>
</template>

<style scoped lang="scss">
.header-title {
  font-size: 1.3rem;
  img {
    margin-right: 0.5rem;
  }
  :deep(a) {
    font-weight: 900;
    color: v-bind(titleColor) !important;
  }
  :deep(a:hover) {
    color: v-bind(titleHoverColor) !important;
  }
}
</style>
