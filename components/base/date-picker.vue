<script setup lang="ts">
import { formatLocalDate } from '@/utils/misc'

const props = defineProps<{
  modelValue?: Date | string | null
  label?: string
  pickerTitle?: string
  placeholder?: string
  errorMessages?: string | string[]
}>()
const emit = defineEmits<{
  'update:modelValue': [value: Date | string | null]
}>()

const datepickerMenu = ref(false)
const datepickerValue = ref<Date>(new Date())
onMounted(() => {
  if (props.modelValue) {
    datepickerValue.value = new Date(props.modelValue)
  }
})
watch(datepickerValue, () => {
  emit('update:modelValue', datepickerValue.value)
  datepickerMenu.value = false
})

const formattedDate = computed(() =>
  props.modelValue ? formatLocalDate(props.modelValue, 'YYYY/MM/DD') : ''
)
</script>

<template>
  <v-menu
    v-model="datepickerMenu"
    :close-on-content-click="false"
    location="bottom"
  >
    <template #activator="{ props: on }">
      <v-text-field
        :model-value="formattedDate"
        :error-messages="errorMessages"
        :label="label"
        :placeholder="placeholder"
        readonly
        prepend-inner-icon="mdi-calendar"
        v-bind="on"
        @click:prepend-inner="datepickerMenu = !datepickerMenu"
      />
    </template>
    <v-date-picker
      v-model="datepickerValue"
      :title="pickerTitle"
      color="primary"
    >
      <template #header />
    </v-date-picker>
  </v-menu>
</template>
