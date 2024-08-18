<script setup lang="ts">
export type MenuItemType = 'subheader' | 'divider' | undefined
export type MenuItem =
  | {
      type: MenuItemType
    }
  | {
      title: string
      value: number | string
      props?: {
        color?: string
        prependIcon?: string
        appendIcon?: string
      }
    }

withDefaults(
  defineProps<{
    items: MenuItem[]
    location?:
      | 'top'
      | 'bottom'
      | 'start'
      | 'end'
      | 'center'
      | 'top start'
      | 'top end'
      | 'bottom start'
      | 'bottom end'
  }>(),
  {
    location: 'bottom',
  }
)

const emit = defineEmits<{
  select: [value: number | string]
}>()

const onSelect = (value: { id: unknown; value: boolean; path: unknown[] }) => {
  emit('select', value.id as number | string)
}
</script>

<template>
  <v-menu :location="location">
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>
    <v-list :items="items" @click:select="onSelect" />
  </v-menu>
</template>
