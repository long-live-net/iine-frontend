<script setup lang="ts">
const { headerString = '' } = defineProps<{ headerString?: string }>()
</script>

<template>
  <h3 class="section-title">
    <span>{{ headerString }}</span>
  </h3>
</template>

<style scoped lang="scss">
.section-title {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  span {
    background: linear-gradient(transparent 75%, orange 75%);
    font-weight: bold;
  }
}
</style>
