<script setup lang="ts">
const props = defineProps<{ url: string }>()
const emit = defineEmits<{
  'update:url': [value: string]
  delete: []
  cancel: []
}>()

const inputUrl = ref('')
watch(
  () => props.url,
  () => {
    if (inputUrl.value !== props.url) {
      inputUrl.value = props.url
    }
  },
  { immediate: true }
)

const errorMessage = ref('')
const { validateUrl } = useValidateRules()

const onUpdateUrl = () => {
  if (!validateUrl(inputUrl.value)) {
    errorMessage.value = 'URL形式で入力してください。'
    return
  }
  errorMessage.value = ''
  emit('update:url', inputUrl.value)
}
</script>

<template>
  <div class="sub-input-url elevation-4">
    <div class="controller">
      <v-text-field
        v-model="inputUrl"
        type="url"
        label="Link URL"
        variant="outlined"
        density="compact"
        :error-messages="errorMessage"
      />
    </div>
    <div class="actions">
      <div>
        <v-btn
          v-if="url"
          color="black"
          icon="mdi-delete"
          size="x-small"
          class="mr-2"
          @click="$emit('delete')"
        />
      </div>
      <div>
        <v-btn
          color="success"
          icon="mdi-content-save"
          size="x-small"
          :disabled="!inputUrl"
          class="mr-2"
          @click="onUpdateUrl"
        />
        <v-btn
          variant="outlined"
          color="black"
          icon="mdi-close"
          size="x-small"
          @click="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sub-input-url {
  padding: 1rem;
  width: 90%;
  min-width: 275px;
  color: $black;
  background-color: $white;
  border-radius: 4px;

  .actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
