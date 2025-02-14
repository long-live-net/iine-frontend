<script setup lang="ts">
import type { FeatureForm } from '@/types/content'
import { useFeatureActions } from '~/composables/use-content/use-features'

const emit = defineEmits<{ 'update:data': [] }>()

const { customerId } = useCustomer()
const { canEdit } = useCustomerPageContext()
const {
  featureRef,
  featurePreNextIdRefRef,
  loading,
  onLoad,
  onUpdate,
  onRemove,
  onUpdateTitleSetting,
  onUpdateImageSetting,
} = useFeatureActions(customerId)

const bodyPlainString = computed(
  () =>
    featureRef.value?.body?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '') ?? ''
)

const onUpdateData = async (params: { id: string; formData: FeatureForm }) => {
  await onUpdate(params)
  emit('update:data')
}
const onRemoveData = async (id: string) => {
  await onRemove(id)
  emit('update:data')
}

const route = useRoute()
const contentId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const preUrl = computed(() =>
  featurePreNextIdRefRef.value?.preId
    ? `/features/${featurePreNextIdRefRef.value.preId}`
    : null
)
const nextUrl = computed(() =>
  featurePreNextIdRefRef.value?.nextId
    ? `/features/${featurePreNextIdRefRef.value.nextId}`
    : null
)

await onLoad(contentId)
</script>

<template>
  <CommonContentWrap :loading="loading">
    <CommonContentSlidableNavigation :pre-url="preUrl" :next-url="nextUrl">
      <CommonContentCard class="feature-detail">
        <CommonContentItemAnimation
          :thresholds="[0.5]"
          animation-name="gFadeIn"
          animation-duration="1.5s"
          class="g-block-sm"
        >
          <CommonContentCardTitle
            :title="featureRef?.title ?? ''"
            class="g-block-sm"
          />
        </CommonContentItemAnimation>
        <template v-if="featureRef?.image">
          <CommonContentItemAnimation
            :thresholds="[0.5]"
            animation-name="gFadeIn"
            animation-duration="1.5s"
          >
            <CommonEyecatchImage
              :url="featureRef?.image?.url"
              :settings="featureRef?.imageSettings"
              class="eyecatcher"
            >
              <template #default>
                <CommonEyecatchTitleSettingPosition
                  :settings="featureRef?.titleSettings"
                  :can-edit="canEdit"
                  class="g-block-lg"
                  @update="onUpdateTitleSetting"
                >
                  <template #default>
                    <CommonContentItemAnimation
                      :thresholds="[0.5]"
                      animation-name="gZoomIn"
                      animation-duration="1s"
                    >
                      <CommonEyecatchTitle
                        place="section"
                        :title="featureRef?.title"
                        :settings="featureRef?.titleSettings"
                        text-no-wrap
                      />
                    </CommonContentItemAnimation>
                  </template>
                  <template #sideSettings>
                    <CommonEyecatchTitleSetting
                      :settings="featureRef?.titleSettings"
                      @update="onUpdateTitleSetting"
                    />
                  </template>
                </CommonEyecatchTitleSettingPosition>
              </template>
              <template v-if="canEdit && featureRef" #settings>
                <CommonEyecatchImageSetting
                  :settings="featureRef.imageSettings"
                  no-parallax
                  @update="onUpdateImageSetting"
                />
              </template>
            </CommonEyecatchImage>
          </CommonContentItemAnimation>
        </template>
        <CommonContentPreNextNagivation :pre-url="preUrl" :next-url="nextUrl" />
        <CommonContentCardBody>
          <div v-if="bodyPlainString">
            <CommonWysiwsgViewer :value="featureRef?.body" />
          </div>
          <div v-else class="no-items">
            <p>データがありません</p>
            <div v-if="canEdit">
              <ManageContentFeatureBody
                v-if="featureRef"
                :feature-data="featureRef"
                activator-label="本文を登録してください"
                @update="onUpdateData"
                @remove="onRemoveData"
              />
              <p v-else class="mt-9">
                <nuxt-link :to="{ name: 'index' }">HOMEに戻る</nuxt-link>
              </p>
            </div>
          </div>
        </CommonContentCardBody>
        <div v-if="canEdit && featureRef?.id" class="edit-activator">
          <ManageContentFeatureBody
            :feature-data="featureRef"
            @update="onUpdateData"
            @remove="onRemoveData"
          />
        </div>
      </CommonContentCard>
    </CommonContentSlidableNavigation>
  </CommonContentWrap>
</template>

<style scoped lang="scss">
.feature-detail {
  position: relative;

  .edit-activator {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;

    @media only screen and (max-width: $grid-breakpoint-md) {
      top: 5rem;
    }
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
