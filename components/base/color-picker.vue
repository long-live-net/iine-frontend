<script setup lang="ts">
import { colorStringToValues } from '@/composables/use-content/use-base-content'

const color = defineModel<string>('color', { required: true })

withDefaults(
  defineProps<{
    useDelete?: boolean
  }>(),
  {
    useDelete: false,
  }
)
defineEmits<{ close: [] }>()

const pickerColor = computed<string>({
  get: () => (color.value === 'transparent' ? '#000000' : color.value),
  set: (col: string) => {
    color.value = col
  },
})
const btnColor = computed(() => colorStringToValues(color.value))
</script>

<template>
  <div class="color-picker">
    <div class="controller">
      <v-color-picker
        v-model="pickerColor"
        hide-canvas
        hide-inputs
        show-swatches
        :swatches-max-height="120"
      />
    </div>
    <div class="actions">
      <div class="d-flex align-center">
        <v-btn
          v-if="useDelete && color"
          size="small"
          prepend-icon="mdi-circle-opacity"
          :color="btnColor"
          @click="color = 'transparent'"
          >クリア</v-btn
        >
        <p v-else>
          <b :style="{ color }">Font Color</b>
        </p>
      </div>
      <div>
        <v-btn
          size="small"
          append-icon="mdi-close"
          color="grey-darken-4"
          @click="$emit('close')"
          >閉じる</v-btn
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-picker {
  padding: 0;
  color: $black;
  background-color: rgb(225 225 225);
  border-radius: 4px;

  .actions {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
