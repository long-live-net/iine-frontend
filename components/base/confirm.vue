<script setup lang="ts">
const comfirm = defineModel<boolean>('comfirm', { required: true })
withDefaults(
  defineProps<{
    title?: string
    titleIcon?: string
    titleColor?: string
    message: string
    execText?: string
    cancelText?: string
    noCancel?: boolean
    loading?: boolean
    width?: string
    maxWidth?: string
    minWidth?: string
  }>(),
  {
    title: undefined,
    titleIcon: undefined,
    titleColor: 'info',
    execText: '実行する',
    cancelText: 'キャンセル',
    noCancel: false,
    loading: false,
    width: '80%',
    maxWidth: '480px',
    minWidth: 'auto',
  }
)
defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <BaseDialog
    v-model:modal="comfirm"
    :width="width"
    :max-width="maxWidth"
    min-width="minWidth"
  >
    <v-card>
      <v-card-title v-if="title && titleIcon" class="confirm-title">
        <v-icon :icon="titleIcon" :color="titleColor" />
        <p>{{ title }}</p>
      </v-card-title>
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
            v-if="!noCancel"
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
.confirm-title {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1rem;
  border-bottom: 1px solid lightgrey;
  font-weight: bold;
  font-size: 1.1rem;
}
.action-button {
  min-width: 6rem;
}
</style>
