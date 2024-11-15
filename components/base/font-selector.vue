<script setup lang="ts">
export type FontFamilyItem = {
  key: string
  value: string
  text: string
}
const fontFamily = defineModel<string>('fontFamily', { required: true })
defineProps<{ fontFamilyItems: FontFamilyItem[] }>()
</script>

<template>
  <div class="font-selector">
    <v-select
      v-model="fontFamily"
      :items="fontFamilyItems"
      item-title="key"
      item-value="value"
      density="comfortable"
      label="フォント"
      hide-details
    >
      <template #item="{ props: itemProps, item }">
        <v-list-item
          v-bind="itemProps"
          :title="`${item.raw.text}: ${item.raw.key}`"
          :style="{ 'font-family': item.raw.value }"
        ></v-list-item>
      </template>
    </v-select>
  </div>
</template>
