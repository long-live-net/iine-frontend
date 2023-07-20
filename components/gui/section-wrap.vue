<script setup lang="ts">
type SectionWrapProps = {
  loading?: boolean
}
const { loading = false } = defineProps<SectionWrapProps>()
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
