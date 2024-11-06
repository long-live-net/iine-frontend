<script setup lang="ts">
import type { TitleSettings } from '@/types/content'
import { positionStringToValues } from '@/composables/use-content/use-base-content'

const props = defineProps<{ settings?: TitleSettings | null }>()
const emit = defineEmits<{
  update: [partOfSettings: Partial<TitleSettings>]
}>()

const subMenuLocation = computed(() => {
  const posx = positionStringToValues(props.settings?.position).x
  if (posx > 50) {
    return 'left'
  } else {
    return 'right'
  }
})

const fontFamily = computed<string>({
  get: () => props.settings?.fontFamily ?? 'inherit',
  set: (value) => {
    if (value) {
      emit('update', { fontFamily: value })
    }
  },
})
const txColor = computed<string>({
  get: () => props.settings?.color ?? '#FFF',
  set: (value) => {
    if (value) {
      emit('update', { color: value })
    }
  },
})
const bgColor = computed<string>({
  get: () => props.settings?.bgColor ?? '#FFF',
  set: (value) => {
    if (value) {
      emit('update', { bgColor: value })
    }
  },
})
</script>

<template>
  <div>
    <div>
      <CommonMenuFontSelector
        v-model:font-family="fontFamily"
        activater-label="フォント"
        :location="subMenuLocation"
      />
    </div>
    <div>
      <CommonMenuColorPicker
        v-model:color="txColor"
        activater-label="文字色"
        :location="subMenuLocation"
      />
    </div>
    <div>
      <CommonMenuColorPicker
        v-model:color="bgColor"
        activater-label="背景色"
        :location="subMenuLocation"
        use-delete
      />
    </div>
  </div>
</template>
