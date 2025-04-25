<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'
const tab = defineModel<boolean>('tab', { required: true })

withDefaults(
  defineProps<{
    tabItems: UiTabItem[]
    alignTabs?: 'title' | 'end' | 'start' | 'center'
    showArrows?: boolean
  }>(),
  {
    alignTabs: 'center',
    showArrows: false,
  }
)
</script>

<template>
  <v-tabs
    v-model="tab"
    :align-tabs="alignTabs"
    :show-arrows="showArrows"
    selected-class="content-tabs-selected"
  >
    <v-tab v-for="item in tabItems" :key="item.key" :value="item.value">{{
      item.label
    }}</v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="item in tabItems"
      :key="item.key"
      :value="item.value"
    >
      <slot />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<style lang="scss" scoped>
.content-tabs-selected {
  background-color: #ddd;
}
</style>
