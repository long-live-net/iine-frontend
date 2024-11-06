<script setup lang="ts">
import { colorStringToValues } from '@/composables/use-content/use-base-content'

const color = defineModel<string>('color', { required: true })
withDefaults(
  defineProps<{
    activaterLabel: string
    location?:
      | 'top'
      | 'top center'
      | 'top right'
      | 'right'
      | 'left'
      | 'bottom'
      | 'bottom center'
      | 'bottom right'
    useDelete?: boolean
  }>(),
  {
    location: 'bottom',
    useDelete: false,
  }
)
const pickerMenu = ref(false)
const btnColor = computed(() => colorStringToValues(color.value))
</script>

<template>
  <v-menu
    v-model="pickerMenu"
    :location="location"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <v-btn v-bind="menuProps" size="small" :color="btnColor" width="64px">
        {{ activaterLabel }}
      </v-btn>
    </template>

    <BaseColorPicker
      v-model:color="color"
      :use-delete="useDelete"
      @close="pickerMenu = false"
    />
  </v-menu>
</template>
