<script setup lang="ts">
import type { ServiceForm } from '@/types/content'

const emit = defineEmits<{ 'update:data': [] }>()

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  serviceRef,
  servicePreNextIdRefRef,
  loading,
  onLoad,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useServiceActions(customerId)

const bodyPlainString = computed(
  () =>
    serviceRef.value?.body?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') ?? ''
)

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

const preUrl = computed(() =>
  servicePreNextIdRefRef.value?.preId
    ? `/services/${servicePreNextIdRefRef.value.preId}`
    : null
)
const nextUrl = computed(() =>
  servicePreNextIdRefRef.value?.nextId
    ? `/services/${servicePreNextIdRefRef.value.nextId}`
    : null
)

await onLoad(contentId)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentSlidableNavigation :pre-url="preUrl" :next-url="nextUrl">
      <CommonContentCard class="service-detail">
        <template #default>
          <CommonContentCardTitle
            :title="serviceRef?.title ?? ''"
            class="g-block-sm"
          />
          <template v-if="serviceRef?.image">
            <CommonContentItemAnimation
              :thresholds="[0]"
              animation-name="gFadeIn"
              animation-duration="1.5s"
            >
              <CommonEyecatchImage
                :url="serviceRef?.image?.url"
                :settings="serviceRef?.imageSettings"
                class="eyecatcher"
              >
                <template #default>
                  <CommonEyecatchTitleSettingPosition
                    :settings="serviceRef?.titleSettings"
                    :can-edit="canEdit"
                    class="g-block-lg"
                    @update="onUpdateTitleSetting"
                  >
                    <template #default>
                      <CommonContentItemAnimation
                        :thresholds="[0]"
                        animation-name="gZoomIn"
                        animation-duration="1s"
                      >
                        <CommonEyecatchTitle
                          place="section"
                          :title="serviceRef?.title"
                          :settings="serviceRef?.titleSettings"
                          text-no-wrap
                        />
                      </CommonContentItemAnimation>
                    </template>
                    <template #sideSettings>
                      <CommonEyecatchTitleSetting
                        :settings="serviceRef?.titleSettings"
                        @update="onUpdateTitleSetting"
                      />
                    </template>
                  </CommonEyecatchTitleSettingPosition>
                </template>
                <template v-if="canEdit && serviceRef" #settings>
                  <CommonEyecatchImageSetting
                    :settings="serviceRef.imageSettings"
                    @update="onUpdateImageSetting"
                  />
                </template>
              </CommonEyecatchImage>
            </CommonContentItemAnimation>
          </template>
          <CommonContentPreNextNagivation
            :pre-url="preUrl"
            :next-url="nextUrl"
          />
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
    </CommonContentSlidableNavigation>
  </CommonContentWrap>
</template>

<style scoped lang="scss">
.service-detail {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
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
  height: 30vh;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.6);

  @media only screen and (max-width: $grid-breakpoint-md) {
    height: 30vw;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
  }
}
</style>
