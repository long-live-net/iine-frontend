<script setup lang="ts">
import type { ServiceForm } from '@/types/content'

const emit = defineEmits<{ 'update:data': [] }>()

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  serviceRef,
  loading,
  onLoad,
  onUpdate,
  onRemove,
  onUpdateImageSetting,
} = useServiceActions(customerId)

const bodyPlainString = computed(() => {
  const plainString =
    serviceRef.value?.body?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') ?? ''
  return plainString
})

const onUpdateData = async (params: { id: number; formData: ServiceForm }) => {
  await onUpdate(params)
  emit('update:data')
}
const onRemoveData = async (id: number) => {
  await onRemove(id)
  emit('update:data')
}

const route = useRoute()
const contentId = parseInt(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)
await onLoad(contentId)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentCard class="service-detail">
      <template #default>
        <CommonContentCardTitle
          :title="serviceRef?.title ?? ''"
          class="g-block-sm"
        />
        <CommonEyecatchImage
          v-if="serviceRef?.image"
          :url="serviceRef?.image?.url"
          :settings="serviceRef?.image?.settings"
          class="eyecatcher"
        >
          <CommonEyecatchTitle
            place="section"
            :title="serviceRef?.title"
            :title-background-tranparent="0.6"
            class="g-block-lg eyecatcher__titles"
          />
          <div
            v-if="canEdit && serviceRef?.image?.settings"
            class="image-settings"
          >
            <ManageContentImageSetting
              :settings="serviceRef.image.settings"
              @update="onUpdateImageSetting"
            />
          </div>
        </CommonEyecatchImage>
        <CommonContentCardBody>
          <div v-if="bodyPlainString">
            <CommonWysiwsgViewer :value="serviceRef?.body" />
          </div>
          <div v-else class="no-items">
            <p>データがありません</p>
            <div v-if="canEdit">
              <ManageContentServiceBody
                v-if="serviceRef"
                :service-data="serviceRef"
                activater-label="本文を登録してください"
                @update="onUpdateData"
                @remove="onRemoveData"
              />
              <p v-else class="mt-9">
                <nuxt-link :to="{ name: 'index' }">HOMEに戻る</nuxt-link>
              </p>
            </div>
          </div>
        </CommonContentCardBody>
        <div v-if="canEdit && serviceRef?.id" class="edit-activator">
          <ManageContentServiceBody
            :service-data="serviceRef"
            @update="onUpdateData"
            @remove="onRemoveData"
          />
        </div>
      </template>
    </CommonContentCard>
  </CommonContentWrap>
</template>

<style scoped lang="scss">
.service-detail {
  position: relative;
  .edit-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
    p {
      font-weight: bold;
      color: $accent;
    }
  }
}

$eyecatcher-height: 480px;
$eyecatcher-height-sm: 300px;

.eyecatcher {
  position: relative;
  height: 30vh;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.6);
  &__titles {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .image-settings {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatcher {
    height: 30vw;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
    .image-settings {
      bottom: 0.2rem;
      right: 0.5rem;
    }
  }
  .nav-pre-next-link {
    margin-bottom: 1.5rem;
  }
}
</style>
