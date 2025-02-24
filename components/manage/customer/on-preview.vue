<script setup lang="ts">
defineProps<{ isPreview: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <div>
    <v-btn
      v-if="isPreview"
      color="warning"
      prepend-icon="mdi-eye-outline"
      size="small"
      width="240px"
      @click="$emit('click')"
    >
      プレビュー中です
    </v-btn>
    <v-btn
      v-else
      color="success"
      prepend-icon="mdi-eye"
      size="small"
      width="130px"
      @click="$emit('click')"
    >
      プレビュー
    </v-btn>
  </div>
</template>
