<script setup lang="ts">
const modal = ref(false)
</script>

<template>
  <div>
    <div class="g-block-lg">
      <v-btn prepend-icon="mdi-email" variant="text" @click="modal = true">
        お問い合わせ
      </v-btn>
    </div>
    <div class="g-block-sm">
      <v-btn icon variant="text" @click="modal = true">
        <v-icon>mdi-email</v-icon>
      </v-btn>
    </div>
    <PublishInquireDialog v-model:modal="modal" />
  </div>
</template>
