<script setup lang="ts">
import type { CustomerSetting } from '@/types/customer-setting'

const props = withDefaults(
  defineProps<{
    customerSetting: CustomerSetting | null
    loading?: boolean
  }>(),
  {
    customerSetting: null,
    loading: false,
  }
)
defineEmits<{
  edit: []
}>()

const { getSeoTagName } = useCustomerSeoTags()
const metaInfos = computed(() => [...(props.customerSetting?.seoTags ?? [])])
</script>

<template>
  <div class="customer-info-wrap">
    <div class="customer-info-data g-theme-profile">
      <dl v-if="metaInfos.length">
        <template v-for="meta in metaInfos" :key="meta.keyName">
          <dt>
            {{ getSeoTagName(meta.keyName) }}
          </dt>
          <dd v-if="meta.keyName === 'ogImage'">
            <p>
              <small>{{ meta.content || '-' }}</small>
            </p>
            <p v-if="meta.content?.length">
              <img
                :src="meta.content"
                alt="ogImage"
                class="mt-2"
                style="width: 200px; height: auto"
              />
            </p>
          </dd>
          <dd v-else>
            {{ meta.content || '-' }}
          </dd>
        </template>
      </dl>
      <div v-else>
        <p>設定されていません。</p>
        <p>編集するボタンからSEOタグ情報を設定できます。</p>
      </div>
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
