<script setup lang="ts">
const props = defineProps<{ color: string }>()
defineEmits<{
  'update:color': [value: string]
  delete: []
  cancel: []
}>()

// const swatches = [
//   ['#FF0000', '#AA0000', '#550000'],
//   ['#FFFF00', '#AAAA00', '#555500'],
//   ['#00FF00', '#00AA00', '#005500'],
//   ['#00FFFF', '#00AAAA', '#005555'],
//   ['#0000FF', '#0000AA', '#000055'],
// ]
const inputColor = ref('')
watch(
  () => props.color,
  () => {
    if (inputColor.value !== props.color) {
      inputColor.value = props.color
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="sub-input-color elevation-4">
    <div class="controller">
      <v-color-picker
        :model-value="inputColor"
        hide-canvas
        hide-inputs
        show-swatches
        :swatches-max-height="120"
        @update:model-value="$emit('update:color', $event)"
      />
    </div>
    <div class="actions">
      <div class="d-flex align-center">
        <v-btn
          v-if="color"
          :color="inputColor"
          icon="mdi-delete"
          size="x-small"
          class="mr-2"
          @click="$emit('delete')"
        />
        <p :style="{ color: inputColor }">
          <b>Font Color</b>
        </p>
      </div>
      <div>
        <v-btn
          variant="outlined"
          color="black"
          icon="mdi-close"
          size="x-small"
          @click="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sub-input-color {
  padding: 0;
  color: $black;
  background-color: $white;
  border-radius: 4px;

  .actions {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
