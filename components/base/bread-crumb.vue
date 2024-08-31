<script setup lang="ts">
export type BreadCrumbsItem = {
  title: string
  disabled: boolean
  href?: string
  to?: string | { name: string; hash?: string }
}
defineProps<{
  items: BreadCrumbsItem[]
}>()
</script>

<template>
  <v-breadcrumbs :items="items" class="bread-crumb" />
</template>

<style lang="scss" scoped></style>
