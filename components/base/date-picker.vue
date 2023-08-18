<script setup lang="ts">
import { VDatePicker } from 'vuetify/labs/VDatePicker'

const props = withDefaults(
  defineProps<{
    modelValue?: Date | null
    rules?: ((v: string) => boolean | string)[]
    label?: string
    pickerTitle?: string
    placeholder?: string
  }>(),
  { rules: () => [] }
)
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

const datepickerMenu = ref(false)
const datepickerValue = ref<Date[] | Date | undefined>()
watch(datepickerValue, () => {
  emit('update:modelValue', (datepickerValue.value as Date) ?? null)
})

const formattedDate = computed(() =>
  props.modelValue ? formatLocalDate(props.modelValue, 'YYYY/MM/DD') : null
)
</script>

<template>
  <v-menu
    v-model="datepickerMenu"
    :close-on-content-click="false"
    location="bottom"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="formattedDate"
        :rules="rules"
        :label="label"
        :placeholder="placeholder"
        readonly
        prepend-inner-icon="mdi-calendar"
        @click:prepend-inner="datepickerMenu = !datepickerMenu"
        v-bind="props"
      />
    </template>
    <v-date-picker
      v-model="datepickerValue as Date[] | undefined"
      :title="pickerTitle"
      color="primary"
      @click:save="datepickerMenu = false"
      @click:cancel="datepickerMenu = false"
    >
      <template #header></template>
    </v-date-picker>
  </v-menu>
</template>
