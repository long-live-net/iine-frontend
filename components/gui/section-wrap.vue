<script setup lang="ts">
const { loading = false } = defineProps<{ loading?: boolean }>()
</script>

<template>
  <div class="section-wrap">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.section-wrap {
  width: 100%;
  min-width: 18rem;
}
</style>
