<script setup lang="ts">
const { loading = false } = defineProps<{ loading?: boolean }>()
</script>

<template>
  <div class="content-wrap">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.content-wrap {
  width: 100%;
  min-width: 18rem;
}
</style>
