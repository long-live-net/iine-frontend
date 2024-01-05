<script setup lang="ts">
export type Snackbar = {
  snackbar: boolean
  message: string
  color?: string
}
const props = withDefaults(defineProps<Snackbar>(), { color: 'success' })
const emit = defineEmits<{
  'update:snackbar': [value: boolean]
}>()

const vSnackBar = computed({
  get: () => props.snackbar,
  set: (value) => {
    emit('update:snackbar', value)
  },
})
</script>
<template>
  <v-snackbar v-model="vSnackBar" location="bottom" :color="color">
    {{ message }}
    <template #actions>
      <v-btn
        tile
        class="fill-height"
        valiant="text"
        @click="$emit('update:snackbar', false)"
      >
        閉じる
      </v-btn>
    </template>
  </v-snackbar>
</template>
