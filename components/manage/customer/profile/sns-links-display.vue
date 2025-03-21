<script setup lang="ts">
import type { CustomerSetting } from '@/types/customer-setting'

withDefaults(
  defineProps<{
    customerSetting: CustomerSetting | null
    loading?: boolean
  }>(),
  { loading: false }
)
defineEmits<{
  edit: []
}>()

const { getSnsTitle, getSnsIcon, getSnsColor, onClickLink } =
  useCustomerSnsLinks()
</script>

<template>
  <div class="customer-info-wrap">
    <div class="customer-info-data g-theme-profile">
      <dl>
        <template
          v-for="link in customerSetting?.snsLinks ?? []"
          :key="link.serviceName"
        >
          <dt>
            {{ getSnsTitle(link.serviceName) }}
            <v-icon :color="getSnsColor(link.serviceName)">
              {{ getSnsIcon(link.serviceName) }}
            </v-icon>
          </dt>
          <dd class="text-url">
            <a href="" @click.stop.prevent="onClickLink(link.serviceName)">
              {{ link.url || '-' }}
            </a>
          </dd>
        </template>
      </dl>
      <BaseOverlayLiner :overlay="loading" />
    </div>
    <div class="actions">
      <v-btn
        prepend-icon="mdi-account-edit"
        color="primary"
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
