<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    comfirm: boolean
    message: string
    execText?: string
    cancelText?: string
  }>(),
  {
    execText: '実行する',
    cancelText: 'キャンセル',
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
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-text>
        <p>{{ message }}</p>
        <div class="mt-4 mb-2 p-3 text-right">
          <v-btn color="error" class="mr-1" @click="$emit('confirm')">{{
            execText
          }}</v-btn>
          <v-btn color="secondary" @click="$emit('cancel')">{{
            cancelText
          }}</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
