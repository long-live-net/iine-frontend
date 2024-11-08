<script setup lang="ts">
const align = defineModel<'left' | 'center' | 'right'>('align', {
  required: true,
})
</script>

<template>
  <div class="text-align-selector">
    <v-btn-toggle
      v-model="align"
      divided
      density="compact"
      color="primary"
      mandatory
    >
      <v-btn icon="mdi-format-align-left" value="left" @click.stop></v-btn>
      <v-btn icon="mdi-format-align-center" value="center" @click.stop></v-btn>
      <v-btn icon="mdi-format-align-right" value="right" @click.stop></v-btn>
    </v-btn-toggle>
  </div>
</template>
