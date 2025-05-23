<script setup lang="ts">
const color = defineModel<string>('color', { required: true })
withDefaults(
  defineProps<{
    swatches?: string[][]
  }>(),
  {
    swatches: undefined,
  }
)

const pickerColor = computed<string>({
  get: () => (color.value === 'transparent' ? '#FFFFFF00' : color.value),
  set: (col: string) => {
    color.value = col === '#FFFFFF00' ? 'transparent' : col
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
      :swatches="swatches"
      :swatches-max-height="188"
    />
  </div>
</template>
