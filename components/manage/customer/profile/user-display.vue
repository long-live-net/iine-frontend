<script setup lang="ts">
import type { CustomerUser } from '@/types/customer-user'

withDefaults(
  defineProps<{
    customerUser: CustomerUser | null
    loading?: boolean
  }>(),
  { loading: false }
)
defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="user-info-wrap">
    <div class="user-info-data g-theme-profile">
      <dl>
        <dt>お名前</dt>
        <dd>{{ customerUser?.name || '-' }}</dd>
        <dt>所属テナント</dt>
        <dd>{{ customerUser?.customerName || '-' }}</dd>
        <dt>メールアドレス</dt>
        <dd>{{ customerUser?.email || '-' }}</dd>
        <dt>備考</dt>
        <dd>{{ customerUser?.note || '-' }}</dd>
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
.user-info-wrap {
  .user-info-data {
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
    .user-info-data {
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
