<script setup lang="ts">
import { debounce } from 'es-toolkit/compat'
import type { FontSize } from '@/utils/wysiwsg-editor/tip-tap'

const props = defineProps<{ size: FontSize }>()
const emit = defineEmits<{
  'update:size': [value: FontSize]
  delete: []
}>()

const inputSize = ref<number>(16)
watch(
  () => props.size,
  () => {
    if (inputSize.value !== props.size) {
      inputSize.value = props.size ?? 16
    }
  },
  { immediate: true }
)

const onUpdateSize = debounce((size: number) => {
  emit('update:size', size)
}, 400)
watch(inputSize, (cur) => {
  const propsSize = props.size ?? 16
  if (cur !== propsSize) {
    onUpdateSize(cur)
  }
})

const menuValue = ref(false)
</script>

<template>
  <v-menu
    v-model="menuValue"
    activator="parent"
    location="top"
    :close-on-content-click="false"
  >
    <div class="sub-input-font-size">
      <div class="controller elevation-2">
        <v-slider
          v-model="inputSize"
          :min="10"
          :max="36"
          :step="1"
          show-ticks="always"
          hide-details
          @update:model-value="onUpdateSize"
        >
          <template #append>
            <p>{{ inputSize }}</p>
          </template>
        </v-slider>
      </div>
      <div class="actions">
        <div class="d-flex align-center">
          <v-btn
            v-if="size"
            color="black"
            icon="mdi-delete"
            size="x-small"
            class="mr-2"
            @click="$emit('delete')"
          />
          <p class="sample-title" :style="{ 'font-size': `${inputSize}px` }">
            Font Size
          </p>
        </div>
        <div class="buttons">
          <v-btn
            variant="outlined"
            color="black"
            icon="mdi-close"
            size="x-small"
            @click="menuValue = false"
          />
        </div>
      </div>
    </div>
  </v-menu>
</template>

<style scoped lang="scss">
.sub-input-font-size {
  width: 84dvw;
  max-width: 540px;
  padding: 1rem;
  color: $black;
  background-color: $white;
  border-radius: 4px;

  .actions {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sample-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: clip;
    }

    .buttons {
      margin-left: 0.5rem;
      white-space: nowrap;
    }
  }
}
</style>
