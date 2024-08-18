<script setup lang="ts">
const emit = defineEmits<{
  'update:url': [value: string]
  delete: []
  cancel: []
}>()

const inputUrl = ref('')
const errorMessage = ref('')
const { validateUrl } = useValidateRules()

const onUpdateUrl = () => {
  if (!validateUrl(inputUrl.value)) {
    errorMessage.value = 'URL形式で入力してください。'
    return
  }
  const validUrl = new RegExp('^https://www.youtube.com/')
  if (!validUrl.test(inputUrl.value)) {
    errorMessage.value = 'youtube 以外の動画は設定できません。'
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
        label="Youtube動画のURLを入力してください"
        variant="outlined"
        density="compact"
        :error-messages="errorMessage"
      />
    </div>
    <div class="actions">
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
    justify-content: flex-end;
  }
}
</style>
