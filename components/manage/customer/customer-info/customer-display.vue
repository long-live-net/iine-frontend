<script setup lang="ts">
import type { Customer } from '@/types/customer'

withDefaults(
  defineProps<{
    customer: Customer | null
  }>(),
  { customer: null }
)
defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="customer-info-wrap">
    <dl>
      <dt>テナント名称</dt>
      <dd>{{ customer?.name || '-' }}</dd>
      <dt>代表メールアドレス</dt>
      <dd>{{ customer?.defaultEmail || '-' }}</dd>
      <dt>代表電話番号</dt>
      <dd>{{ customer?.phone || '-' }}</dd>
      <dt>所在地</dt>
      <dd>{{ customer?.address || '-' }}</dd>
      <dt>備考</dt>
      <dd>{{ customer?.note || '-' }}</dd>
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
.customer-info-wrap {
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
  .customer-info-wrap {
    padding: 1rem;
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
