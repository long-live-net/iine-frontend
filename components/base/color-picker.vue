<script setup lang="ts">
const color = defineModel<string>('color', { required: true })
const pickerColor = computed<string>({
  get: () => (color.value === 'transparent' ? '#FFFFFF00' : color.value),
  set: (col: string) => {
    color.value = col
  },
})
</script>

<template>
  <div class="controller">
    <v-color-picker
      v-model="pickerColor"
      hide-canvas
      hide-inputs
      show-swatches
      :swatches-max-height="120"
    />
  </div>
</template>
