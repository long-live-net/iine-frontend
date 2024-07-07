<script setup lang="ts">
import type { Snackbar } from './snackbar.vue'

const snackbars = ref<(Snackbar & { id: number })[]>([])
const idNumber = ref(0)
const addSnackbar = (message: string, color?: string) => {
  const actives = snackbars.value.filter((s) => s.snackbar)
  if (!actives.length) {
    snackbars.value = []
  }
  snackbars.value.push({
    id: idNumber.value++,
    snackbar: true,
    message,
    color,
  })
}

defineExpose({ addSnackbar })
</script>

<template>
  <template v-for="(snack, i) in snackbars">
    <BaseSnackbar
      v-if="snack.snackbar"
      :key="snack.id"
      v-model:snackbar="snack.snackbar"
      :message="snack.message"
      :color="snack.color"
      :style="{ 'margin-bottom': `${i * 55 + 20}px` }"
    />
  </template>
</template>
