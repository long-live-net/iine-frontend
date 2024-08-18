<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    comfirm: boolean
    message: string
    execText?: string
    cancelText?: string
    loading?: boolean
  }>(),
  {
    execText: '実行する',
    cancelText: 'キャンセル',
    loading: false,
  }
)
const emit = defineEmits<{
  'update:comfirm': [comfirm: boolean]
  confirm: []
  cancel: []
}>()

const confirmDialog = computed({
  get: () => props.comfirm,
  set: (modal: boolean) => {
    emit('update:comfirm', modal)
  },
})
</script>

<template>
  <BaseDialog v-model:modal="confirmDialog" :max-width="400">
    <v-card>
      <v-card-text>
        <p>{{ message }}</p>
        <div class="mt-4 mb-2 p-3 text-right">
          <v-btn
            color="error"
            :loading="loading"
            class="action-button mr-2"
            @click="$emit('confirm')"
            >{{ execText }}</v-btn
          >
          <v-btn
            color="secondary"
            class="action-button"
            @click="$emit('cancel')"
            >{{ cancelText }}</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </BaseDialog>
</template>

<style scoped lang="scss">
.action-button {
  min-width: 6rem;
}
</style>
