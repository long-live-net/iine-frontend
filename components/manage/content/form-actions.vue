<script setup lang="ts">
defineProps<{ contentId?: string }>()
defineEmits<{
  create: []
  update: []
  cancel: []
}>()
</script>

<template>
  <div class="d-flex justify-end">
    <div class="g-block-sm">
      <v-btn
        v-if="contentId"
        prepend-icon="mdi-content-save"
        color="success"
        variant="flat"
        @click="$emit('update')"
      >
        更新
      </v-btn>
      <v-btn
        v-else
        prepend-icon="mdi-content-save"
        color="info"
        variant="flat"
        @click="$emit('create')"
      >
        作成
      </v-btn>
      <v-btn
        prepend-icon="mdi-cancel"
        color="secondary"
        variant="flat"
        class="ml-1"
        @click="$emit('cancel')"
      >
        中止
      </v-btn>
    </div>
    <div class="g-block-lg">
      <v-btn
        v-if="contentId"
        prepend-icon="mdi-content-save"
        color="success"
        variant="flat"
        width="8rem"
        @click="$emit('update')"
      >
        更新する
      </v-btn>
      <v-btn
        v-else
        prepend-icon="mdi-content-save"
        color="info"
        variant="flat"
        width="8rem"
        @click="$emit('create')"
      >
        作成する
      </v-btn>
      <v-btn
        prepend-icon="mdi-cancel"
        color="secondary"
        variant="flat"
        width="8rem"
        class="ml-1"
        @click="$emit('cancel')"
      >
        キャンセル
      </v-btn>
    </div>
  </div>
</template>
