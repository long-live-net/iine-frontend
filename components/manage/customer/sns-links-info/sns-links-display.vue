<script setup lang="ts">
import type { CustomerSetting } from '@/types/customer-setting'

withDefaults(
  defineProps<{
    customerSetting: CustomerSetting | null
  }>(),
  { customerSetting: null }
)
defineEmits<{
  edit: []
}>()

const { getSnsTitle, getSnsIcon, getSnsColor, onClickLink } =
  useCustomerSnsLinks()
</script>

<template>
  <div class="customer-info-wrap">
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
