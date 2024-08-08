<script setup lang="ts">
import type { CustomerUser } from '@/types/customer-user'

withDefaults(
  defineProps<{
    customerUser: CustomerUser | null
  }>(),
  { customerUser: null }
)
defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="user-info-wrap">
    <dl>
      <dt>お名前</dt>
      <dd>{{ customerUser?.name || '-' }}</dd>
      <dt>所属</dt>
      <dd>{{ customerUser?.customerName || '-' }}</dd>
      <dt>メールアドレス</dt>
      <dd>{{ customerUser?.email || '-' }}</dd>
      <dt>備考</dt>
      <dd>{{ customerUser?.note || '-' }}</dd>
    </dl>
    <div class="actions">
      <v-btn
        prepend-icon="mdi-account-edit"
        color="accent"
        variant="flat"
        width="8rem"
        @click="$emit('edit')"
      >
        編集する
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-info-wrap {
  padding: 1rem 2rem;
  dl {
    display: grid;
    grid-template-columns: 11rem auto;
    gap: 4px;
    dt {
      padding: 0.5rem 1rem;
      background-color: $gray-lighten2;
      font-weight: bold;
      text-align: right;
    }
    dd {
      padding: 0.5rem 1rem;
      background-color: $gray-lighten4;
    }
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .user-info-wrap {
    dl {
      display: block;
      dt {
        text-align: center;
      }
      dd {
        padding-left: 1.25rem;
        margin-bottom: 12px;
      }
    }
  }
}

.actions {
  margin-top: 1rem;
  text-align: right;
}
</style>
