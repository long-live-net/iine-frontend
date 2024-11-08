<script setup lang="ts">
const fontFamily = defineModel<string>('fontFamily', { required: true })
const props = defineProps<{ fontFamilies: { [key: string]: string } }>()

const fontFamilyItems = computed(() => [
  {
    key: '自動',
    value: 'inherit',
    text: 'おはよう世界',
  },
  ...Object.keys(props.fontFamilies).map((key) => ({
    key,
    value: props.fontFamilies[key],
    text: 'おはよう世界',
  })),
])
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
