<script setup lang="ts">
import type { TitleSettings, TextAlignValue } from '@/types/content'

const props = defineProps<{ settings?: TitleSettings | null }>()
const emit = defineEmits<{
  update: [partOfSettings: Partial<TitleSettings>]
}>()

const textAlign = computed<TextAlignValue>({
  get: () => props.settings?.align ?? 'left',
  set: (value) => {
    if (value) {
      emit('update', { align: value })
    }
  },
})
</script>

<template>
  <div @mousedown.stop>
    <BaseTextAlignSelector v-model:align="textAlign" />
  </div>
</template>
