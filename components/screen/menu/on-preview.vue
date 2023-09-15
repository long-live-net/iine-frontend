<script setup lang="ts">
defineEmits<{ click: [] }>()
</script>

<template>
  <div class="on-preview-wrap">
    <v-btn
      color="yellow"
      prepend-icon="mdi-eye"
      rounded="lg"
      width="260"
      style="text-transform: none; min-width: 8rem"
      @click="$emit('click')"
    >
      プレビュー中です
    </v-btn>
  </div>
</template>
