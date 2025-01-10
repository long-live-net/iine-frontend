<script setup lang="ts">
import type { TitleSettings } from '@/types/content'
import { getFontFamilyItems } from '@/composables/use-customer/use-customer-setting'

const props = defineProps<{ settings?: TitleSettings | null }>()
const emit = defineEmits<{
  update: [partOfSettings: Partial<TitleSettings>]
}>()

const subMenuLocation = computed(() => {
  const posx = useContentUtils().positionStringToValues(
    props.settings?.position
  ).x
  if (posx > 50) {
    return 'left'
  } else {
    return 'right'
  }
})

const fontFamilyItems = computed(() => getFontFamilyItems())
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
  <div @mousedown.stop @touchstart.stop>
    <div>
      <BaseFontSelectorMenu
        v-model:font-family="fontFamily"
        :font-family-items="fontFamilyItems"
        activator-label="フォント"
        activator-button-size="small"
        activator-button-width="64px"
        :location="subMenuLocation"
      />
    </div>
    <div>
      <BaseColorPickerMenu
        v-model:color="txColor"
        activator-label="文字色"
        activator-button-size="small"
        activator-button-width="64px"
        :location="subMenuLocation"
      />
    </div>
    <div>
      <BaseColorPickerMenu
        v-model:color="bgColor"
        activator-label="背景色"
        activator-button-size="small"
        activator-button-width="64px"
        :location="subMenuLocation"
        use-delete
      />
    </div>
  </div>
</template>
