<script setup lang="ts">
import type { Customer } from '@/types/customer'

withDefaults(
  defineProps<{
    customer: Customer | null
    loading?: boolean
  }>(),
  { loading: false }
)
defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="customer-info-wrap">
    <div class="customer-info-data g-theme-profile">
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
      <BaseOverlayLiner :overlay="loading" />
    </div>
    <div class="actions">
      <v-btn
        prepend-icon="mdi-account-edit"
        color="primary"
        variant="flat"
        width="8rem"
        :loading="loading"
        @click="$emit('edit')"
      >
        編集する
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.customer-info-wrap {
  .customer-info-data {
    position: relative;

    dl {
      display: grid;
      grid-template-columns: 11rem auto;
      gap: 4px;

      dt {
        padding: 0.5rem 1rem;
        font-weight: bold;
        text-align: right;
      }

      dd {
        padding: 0.5rem 1rem;
        overflow-wrap: anywhere;
      }
    }
  }

  .actions {
    margin-top: 1rem;
    text-align: right;
  }

  @media only screen and (max-width: $grid-breakpoint-md) {
    .customer-info-data {
      dl {
        display: block;

        dt {
          text-align: center;
        }

        dd {
          padding-left: 1.25rem;
          margin-bottom: 12px;
          max-width: 100%;
        }
      }
    }
  }
}
</style>
