<script setup lang="ts">
const props = defineProps<{
  contentId?: string
}>()

defineEmits<{
  create: []
  update: []
  remove: []
  cancel: []
}>()

const confirmDialog = ref(false)
const onRemove = () => {
  if (props.contentId) {
    confirmDialog.value = true
  }
}
</script>

<template>
  <div class="d-flex justify-space-between">
    <div class="g-block-sm">
      <v-btn
        v-if="contentId"
        prepend-icon="mdi-delete"
        color="error"
        variant="flat"
        stacked
        @click="onRemove"
      >
        削除
      </v-btn>
    </div>
    <div class="g-block-sm">
      <v-btn
        v-if="contentId"
        prepend-icon="mdi-content-save"
        color="success"
        variant="flat"
        stacked
        @click="$emit('update')"
      >
        更新
      </v-btn>
      <v-btn
        v-else
        prepend-icon="mdi-content-save"
        color="info"
        variant="flat"
        stacked
        @click="$emit('create')"
      >
        作成
      </v-btn>
      <v-btn
        prepend-icon="mdi-cancel"
        color="secondary"
        variant="flat"
        stacked
        class="ml-1"
        @click="$emit('cancel')"
      >
        中止
      </v-btn>
    </div>
    <div class="g-block-lg">
      <v-btn
        v-if="contentId"
        prepend-icon="mdi-delete"
        color="error"
        variant="flat"
        width="8rem"
        @click="onRemove"
      >
        削除する
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
    <BaseConfirm
      v-model:comfirm="confirmDialog"
      message="本当に削除しますか？"
      exec-text="削除する"
      @cancel="confirmDialog = false"
      @confirm="$emit('remove')"
    />
  </div>
</template>
